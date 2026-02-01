use wasm_bindgen::prelude::*;
use rustfft::{FftPlanner, num_complex::Complex};

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
        
        // Simulating a more complex S-curve for phase boost in Rust
        let phase_boost = if beat_phase < 0.15 {
            let x = beat_phase / 0.15;
            (1.0 - x * x) * 0.2 // Quadratic falloff
        } else {
            0.0
        };

        ((base_intensity + timbre_boost + phase_boost) * 1.5).min(1.0)
    }
}
