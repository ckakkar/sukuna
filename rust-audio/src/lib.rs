use wasm_bindgen::prelude::*;
use rustfft::{FftPlanner, num_complex::Complex};

/// Frequency spectrum result: bass, mid, treble (0-1)
#[wasm_bindgen]
pub struct FrequencySpectrum {
    pub bass: f32,
    pub mid: f32,
    pub treble: f32,
}

#[wasm_bindgen]
impl FrequencySpectrum {
    #[wasm_bindgen(constructor)]
    pub fn new(bass: f32, mid: f32, treble: f32) -> FrequencySpectrum {
        FrequencySpectrum { bass, mid, treble }
    }
}

#[wasm_bindgen]
pub struct AudioAnalyzer {
    planner: FftPlanner<f32>,
    fft_size: usize,
}

#[wasm_bindgen]
impl AudioAnalyzer {
    #[wasm_bindgen(constructor)]
    pub fn new(fft_size: usize) -> AudioAnalyzer {
        console_error_panic_hook::set_once();
        AudioAnalyzer {
            planner: FftPlanner::new(),
            fft_size,
        }
    }

    pub fn calculate_spectrum(&mut self, time_domain_data: &[f32]) -> Vec<f32> {
        let len = time_domain_data.len();
        let fft = self.planner.plan_fft_forward(len);
        
        let mut buffer: Vec<Complex<f32>> = time_domain_data
            .iter()
            .map(|&val| Complex { re: val, im: 0.0 })
            .collect();
            
        fft.process(&mut buffer);
        
        // Return magnitude of first half (Nyquist freq)
        buffer.iter()
            .take(len / 2)
            .map(|c| c.norm())
            .collect()
    }
    
    pub fn detect_beat(&self, spectrum: &[f32], history: &[f32]) -> bool {
        // Simple spectral flux beat detection
        // Calculate average energy
        let current_energy: f32 = spectrum.iter().sum::<f32>() / spectrum.len() as f32;
        let history_average: f32 = if history.is_empty() {
             0.0 
        } else {
             history.iter().sum::<f32>() / history.len() as f32
        };
        
        // Threshold multiplier (1.3 is standard roughly)
        current_energy > history_average * 1.3
    }
    
    pub fn get_energy(&self, time_domain_data: &[f32]) -> f32 {
         // RMS (Root Mean Square)
         let sum_sq: f32 = time_domain_data.iter().map(|x| x * x).sum();
         (sum_sq / time_domain_data.len() as f32).sqrt()
    }

    pub fn calculate_intensity(
        &self, 
        loudness: f32, 
        confidence: f32, 
        timbre_energy: f32, 
        beat_phase: f32
    ) -> f32 {
        let normalized_timbre = (timbre_energy / 10.0).min(1.0);
        
        let base_intensity = loudness * confidence;
        let timbre_boost = normalized_timbre * 0.3;
        
        let phase_boost = if beat_phase < 0.15 {
            let x = beat_phase / 0.15;
            (1.0 - x * x) * 0.2
        } else {
            0.0
        };

        ((base_intensity + timbre_boost + phase_boost) * 1.5).min(1.0)
    }

    /// Analyze frequency spectrum from 12-dimensional timbre vector (Spotify format).
    /// Returns bass (0-3), mid (4-7), treble (8-11) bands normalized 0-1.
    #[wasm_bindgen]
    pub fn analyze_frequency_spectrum(&self, timbre: Vec<f32>) -> FrequencySpectrum {
        if timbre.len() < 12 {
            return FrequencySpectrum { bass: 0.0, mid: 0.0, treble: 0.0 };
        }
        
        let bass_avg = (timbre[0] + timbre[1] + timbre[2] + timbre[3]) / 4.0;
        let mid_avg = (timbre[4] + timbre[5] + timbre[6] + timbre[7]) / 4.0;
        let treble_avg = (timbre[8] + timbre[9] + timbre[10] + timbre[11]) / 4.0;
        
        let bass = (bass_avg + 0.5).max(0.0).min(1.0);
        let mid = (mid_avg + 0.5).max(0.0).min(1.0);
        let treble = (treble_avg + 0.5).max(0.0).min(1.0);
        
        FrequencySpectrum { bass, mid, treble }
    }
}
