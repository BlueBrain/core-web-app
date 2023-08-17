export const mockEModelAssignedMap: Record<string, string> = {
  'L1_DAC<>bNAC': 'cNAC_12345_2023',
  'L1_DAC<>cNAC': '',
  'L1_HAC<>bNAC': '',
  'L1_HAC<>cIR': '',
  'L1_HAC<>cNAC': 'cNAC_12345_2023',
  'L1_LAC<>cNAC': '',
  'L1_NGC-DA<>bNAC': 'cNAC_188971245_2023',
  'L1_NGC-DA<>cSTUT': '',
  'L1_NGC-SA<>cNAC': '',
  'L1_SAC<>bNAC': '',
  'L1_SAC<>cAC': 'cNAC_12345_2023',
  'L1_SAC<>cNAC': '',
};

export const spikeEventFeatures = [
  'time_to_first_spike',
  'time_to_second_spike',
  'inv_time_to_first_spike',
  'ISI_values',
  'doublet_ISI',
  'all_ISI_values',
  'inv_first_ISI',
  'inv_second_ISI',
  'inv_third_ISI',
  'inv_fourth_ISI',
  'inv_fifth_ISI',
  'inv_last_ISI',
  'time_to_last_spike',
  'Spikecount',
  'Spikecount_stimint',
  'number_initial_spikes',
  'mean_frequency',
  'ISI_semilog_slope',
  'ISI_log_slope',
  'ISI_log_slope_skip',
  'ISI_CV',
  'irregularity_index',
  'adaptation_index',
  'adaptation_index_2',
  'check_AISInitiation',
  'burst_mean_freq',
  'strict_burst_mean_freq',
  'burst_number',
  'strict_burst_number',
  'interburst_voltage',
  'strict_interburst_voltage',
  'interburst_min_values',
  'postburst_min_values',
  'time_to_interburst_min',
  'single_burst_ratio',
] as const;

export const spikeShapeFeatures = [
  'peak_time',
  'peak_voltage',
  'AP_amplitude',
  'AP1_amp',
  'AP2_amp',
  'APlast_amp',
  'mean_AP_amplitude',
  'AP_Amplitude_change',
  'AP_amplitude_from_voltagebase',
  'AP1_peak',
  'AP2_AP1_diff',
  'AP2_AP1_peak_diff',
  'amp_drop_first_second',
  'amp_drop_first_last',
  'amp_drop_second_last',
  'max_amp_difference',
  'AP_amplitude_diff',
  'min_AHP_values',
  'AHP_depth_abs',
  'AHP_depth_abs_slow',
  'AHP_depth_slow',
  'AHP_slow_time',
  'AHP_depth',
  'AHP_depth_diff',
  'fast_AHP',
  'fast_AHP_change',
  'AHP_depth_from_peak',
  'AHP_time_from_peak',
  'ADP_peak_values',
  'ADP_peak_amplitude',
  'depolarized_base',
  'min_voltage_between_spikes',
  'min_between_peaks_values',
  'AP_duration_half_width',
  'AP_duration_half_width_change',
  'AP_width',
  'AP_duration',
  'AP_duration_change',
  'AP_width_between_threshold',
  'spike_half_width',
  'spike_width2',
  'AP_begin_width',
  'AP2_AP1_begin_width_diff',
  'AP_begin_voltage',
  'AP_begin_time',
  'AP_peak_upstroke',
  'AP_peak_downstroke',
  'AP_rise_time',
  'AP_fall_time',
  'AP_rise_rate',
  'AP_fall_rate',
  'AP_rise_rate_change',
  'AP_fall_rate_change',
  'AP_phaseslope',
  'AP_phaseslope_AIS',
  'BPAPHeightLoc1',
  'BPAPHeightLoc2',
  'BPAPAmplitudeLoc1',
  'BPAPAmplitudeLoc2',
  'BAC_width',
  'BAC_maximum_voltage',
] as const;

export const voltageFeatures = [
  'steady_state_voltage_stimend',
  'steady_state_hyper',
  'steady_state_voltage',
  'voltage_base',
  'current_base',
  'time_constant',
  'decay_time_constant_after_stim',
  'multiple_decay_time_constant_after_stim',
  'sag_time_constant',
  'sag_amplitude',
  'sag_ratio1',
  'sag_ratio2',
  'ohmic_input_resistance',
  'ohmic_input_resistance_vb_ssse',
  'voltage_deflection_vb_ssse',
  'voltage_deflection',
  'voltage_deflection_begin',
  'voltage_after_stim',
  'minimum_voltage',
  'maximum_voltage',
  'maximum_voltage_from_voltagebase',
  'depol_block_bool',
] as const;
