export const mockEModelAssignedMap: Record<string, string> = {
  'L2_TPC:A<>cADpyr': 'EM__fa285b7__cADpyr__12',
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
  'AP2_peak',
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
  'AHP1_depth_from_peak',
  'AHP2_depth_from_peak',
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
  'AP1_width',
  'AP2_width',
  'AP1_begin_width',
  'AP2_begin_width',
  'APlast_width',
  'spike_width2',
  'AP_begin_width',
  'AP2_AP1_begin_width_diff',
  'AP_begin_voltage',
  'AP1_begin_voltage',
  'AP2_begin_voltage',
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

export const eCodes = [
  'IDrest',
  'SpikeRecMultiSpikes',
  'IV',
  'APWaveform',
  'FirePattern',
  'sAHP',
  'HyperDepol',
  'DeHyperpol',
  'PosCheops',
  'NegCheops',
  'Ramp',
  'SineSpec',
  'SubWhiteNoise',
  'NoiseOU3',
  'WhiteNoise',
  'Comb',
  'Synaptic',
  'BAC',
  'DendriticStep',
  'MultipleRandomStepInputs',
  'CustomFromFile',
  'IDhyperpol',
] as const;

export const featureDescriptionsMap = {
  'Spike event': {
    time_to_first_spike: 'Time from the start of the stimulus to the maximum of the first peak',
    time_to_second_spike: 'Time from the start of the stimulus to the maximum of the second peak',
    inv_time_to_first_spike: '1.0 over time to first spike; returns 0 when no spike',
    ISI_values:
      'The interspike intervals (i.e. time intervals) between adjacent peaks. If ignore_first_ISI is True, the 1st spike will not be taken into account, because some cells spike right after the stimulus onset and then stay silent for a while.',
    doublet_ISI: 'The time interval between the first two peaks',
    all_ISI_values: 'The interspike intervals, i.e., the time intervals between adjacent peaks.',
    inv_first_ISI: '1.0 over first/second/third/fourth/fith/last ISI; returns 0 when no ISI',
    inv_second_ISI: '1.0 over first/second/third/fourth/fith/last ISI; returns 0 when no ISI',
    inv_third_ISI: '1.0 over first/second/third/fourth/fith/last ISI; returns 0 when no ISI',
    inv_fourth_ISI: '1.0 over first/second/third/fourth/fith/last ISI; returns 0 when no ISI',
    inv_fifth_ISI: '1.0 over first/second/third/fourth/fith/last ISI; returns 0 when no ISI',
    inv_last_ISI: '1.0 over first/second/third/fourth/fith/last ISI; returns 0 when no ISI',
    time_to_last_spike: 'time from stimulus start to last spike',
    Spikecount: 'number of spikes in the trace, including outside of stimulus interval',
    Spikecount_stimint: 'number of spikes inside the stimulus interval',
    number_initial_spikes: 'number of spikes at the beginning of the stimulus',
    mean_frequency: 'The mean frequency of the firing rate',
    ISI_semilog_slope:
      'The slope of a linear fit to a semilog plot of the ISI values.\nAttention: the 1st ISI is not taken into account unless ignore_first_ISI is set to 0. See LibV1: ISI_values feature for more details.',
    ISI_log_slope:
      'The slope of a linear fit to a loglog plot of the ISI values.\nAttention: the 1st ISI is not taken into account unless ignore_first_ISI is set to 0. See LibV1: ISI_values feature for more details.',
    ISI_log_slope_skip:
      'The slope of a linear fit to a loglog plot of the ISI values, but not taking into account the first ISI values.\nThe proportion of ISI values to be skipped is given by spike_skipf (between 0 and 1). However, if this number of ISI values to skip is higher than max_spike_skip, then max_spike_skip is taken instead.',
    ISI_CV:
      'The coefficient of variation of the ISIs.\nAttention: the 1st ISI is not taken into account unless ignore_first_ISI is set to 0. See LibV1: ISI_values feature for more details.',
    irregularity_index:
      'Mean of the absolute difference of all ISIs, except the first one (see LibV1: ISI_values feature for more details.)\nThe first ISI can be taken into account if ignore_first_ISI is set to 0.',
    adaptation_index:
      'Normalized average difference of two consecutive ISIs, skipping the first ISIs\nThe proportion of ISI values to be skipped is given by spike_skipf (between 0 and 1). However, if this number of ISI values to skip is higher than max_spike_skip, then max_spike_skip is taken instead.\nThe adaptation index is zero for a constant firing rate and bigger than zero for a decreasing firing rate',
    adaptation_index_2:
      'Normalized average difference of two consecutive ISIs, starting at the second ISI\nThe adaptation index is zero for a constant firing rate and bigger than zero for a decreasing firing rate',
    check_AISInitiation: 'Check initiation of AP in AIS',
    burst_mean_freq:
      'The mean frequency during a burst for each burst\nIf burst_ISI_indices did not detect any burst beginning, then the spikes are not considered to be part of any burst',
    strict_burst_mean_freq:
      'The mean frequency during a burst for each burst\nThis implementation does not assume that every spike belongs to a burst.\nThe first spike is ignored by default. This can be changed by setting ignore_first_ISI to 0.\nThe burst detection can be fine-tuned by changing the setting strict_burst_factor. Default value is 2.0.',
    burst_number: 'The number of bursts',
    strict_burst_number:
      'The number of bursts\nThis implementation does not assume that every spike belongs to a burst.\nThe first spike is ignored by default. This can be changed by setting ignore_first_ISI to 0.\nThe burst detection can be fine-tuned by changing the setting strict_burst_factor. Default value is 2.0.',
    interburst_voltage:
      'The voltage average in between two bursts\nIterating over the burst ISI indices determine the last peak before the burst. Starting 5 ms after that peak take the voltage average until 5 ms before the first peak of the subsequent burst.',
    strict_interburst_voltage:
      'The voltage average in between two bursts\nIterating over the burst indices determine the first peak of each burst. Starting 5 ms after the previous peak, take the voltage average until 5 ms before the peak.\nThis implementation does not assume that every spike belongs to a burst.\nThe first spike is ignored by default. This can be changed by setting ignore_first_ISI to 0.\nThe burst detection can be fine-tuned by changing the setting strict_burst_factor. Default value is 2.0.',
    interburst_min_values:
      'The minimum voltage between the end of a burst and the next spike.\nThis implementation does not assume that every spike belongs to a burst.\nThe first spike is ignored by default. This can be changed by setting ignore_first_ISI to 0.\nThe burst detection can be fine-tuned by changing the setting strict_burst_factor. Default value is 2.0.',
    postburst_min_values:
      'The minimum voltage after the end of a burst.\nThis implementation does not assume that every spike belongs to a burst.\nThe first spike is ignored by default. This can be changed by setting ignore_first_ISI to 0.\nThe burst detection can be fine-tuned by changing the setting strict_burst_factor. Default value is 2.0.',
    time_to_interburst_min:
      'The time between the last spike of a burst and the minimum between that spike and the next.\nThis implementation does not assume that every spike belongs to a burst.\nThe first spike is ignored by default. This can be changed by setting ignore_first_ISI to 0.\nThe burst detection can be fine-tuned by changing the setting strict_burst_factor. Default value is 2.0.',
    single_burst_ratio:
      'Length of the second isi over the median of the rest of the isis. The first isi is not taken into account, because it could bias the feature. See LibV1: ISI_values feature for more details.\nIf ignore_first_ISI is set to 0, then signle burst ratio becomes the length of the first isi over the median of the rest of the isis.',
  },
  'Spike shape': {
    peak_time: 'The times of the maxima of the peaks',
    peak_voltage: 'The voltages at the maxima of the peaks',
    AP_amplitude: 'The relative height of the action potential from spike onset',
    AP1_amp: 'The relative height of the action potential from spike onset',
    AP2_amp: 'The relative height of the action potential from spike onset',
    APlast_amp: 'The relative height of the action potential from spike onset',
    mean_AP_amplitude: 'The mean of all of the action potential amplitudes',
    AP_Amplitude_change:
      'Difference of the amplitudes of the second and the first action potential divided by the amplitude of the first action potential',
    AP_amplitude_from_voltagebase: 'The relative height of the action potential from voltage base',
    AP1_peak: 'The peak voltage of the first and second action potentials',
    AP2_peak: 'The peak voltage of the first and second action potentials',
    AP2_AP1_diff: 'Difference amplitude of the second to first spike',
    AP2_AP1_peak_diff: 'Difference peak voltage of the second to first spike',
    amp_drop_first_second: 'Difference of the amplitude of the first and the second peak',
    amp_drop_first_last: 'Difference of the amplitude of the first and the last peak',
    amp_drop_second_last: 'Difference of the amplitude of the second and the last peak',
    max_amp_difference: 'Maximum difference of the height of two subsequent peaks',
    AP_amplitude_diff: 'Difference of the amplitude of two subsequent peaks',
    min_AHP_values: 'Absolute voltage values at the first after-hyperpolarization.',
    AHP_depth_abs:
      'Absolute voltage values at the first after-hyperpolarization. Is the same as min_AHP_values',
    AHP_depth_abs_slow:
      'Absolute voltage values at the first after-hyperpolarization starting a given number of ms (default: 5) after the peak',
    AHP_depth_slow:
      'Relative voltage values at the first after-hyperpolarization starting a given number of ms (default: 5) after the peak',
    AHP_slow_time:
      'Time difference between slow AHP (see AHP_depth_abs_slow) and peak, divided by interspike interval',
    AHP_depth: 'Relative voltage values at the first after-hyperpolarization',
    AHP_depth_diff:
      'Difference of subsequent relative voltage values at the first after-hyperpolarization',
    fast_AHP:
      'Voltage value of the action potential onset relative to the subsequent AHP\nIgnores the last spike',
    fast_AHP_change:
      'Difference of the fast AHP of the second and the first action potential divided by the fast AHP of the first action potential',
    AHP_depth_from_peak: 'Voltage difference between AP peaks and first AHP depths',
    AHP1_depth_from_peak: 'Voltage difference between AP peaks and first AHP depths',
    AHP2_depth_from_peak: 'Voltage difference between AP peaks and first AHP depths',
    AHP_time_from_peak: 'Time between AP peaks and first AHP depths',
    ADP_peak_values:
      'Absolute voltage values of the small afterdepolarization peak\nstrict_stiminterval should be set to True for this feature to behave as expected.',
    ADP_peak_amplitude:
      'Amplitude of the small afterdepolarization peak with respect to the fast AHP voltage\nstrict_stiminterval should be set to True for this feature to behave as expected.',
    depolarized_base:
      'Mean voltage between consecutive spikes (from the end of one spike to the beginning of the next one)',
    min_voltage_between_spikes: 'Minimal voltage between consecutive spikes',
    min_between_peaks_values:
      'Minimal voltage between consecutive spikes\nThe last value of min_between_peaks_values is the minimum between last spike and stimulus end if strict stiminterval is True, and minimum between last spike and last voltage value if strict stiminterval is False',
    AP_duration_half_width:
      'Width of spike at half spike amplitude, with spike onset as described in LibV5: AP_begin_time',
    AP_duration_half_width_change:
      'Difference of the FWHM of the second and the first action potential divided by the FWHM of the first action potential',
    AP_width:
      'Width of spike at threshold, bounded by minimum AHP\nCan use strict_stiminterval compute only for data in stimulus interval.',
    AP_duration: 'Duration of an action potential from onset to offset',
    AP_duration_change:
      'Difference of the durations of the second and the first action potential divided by the duration of the first action potential',
    AP_width_between_threshold:
      'Width of spike at threshold, bounded by minimum between peaks\nCan use strict_stiminterval to not use minimum after stimulus end.',
    spike_half_width:
      'Width of spike at half spike amplitude, with the spike amplitude taken as the difference between the minimum between two peaks and the next peak',
    AP1_width:
      'Width of spike at half spike amplitude, with the spike amplitude taken as the difference between the minimum between two peaks and the next peak',
    AP2_width:
      'Width of spike at half spike amplitude, with the spike amplitude taken as the difference between the minimum between two peaks and the next peak',
    APlast_width:
      'Width of spike at half spike amplitude, with the spike amplitude taken as the difference between the minimum between two peaks and the next peak',
    spike_width2:
      'Width of spike at half spike amplitude, with the spike onset taken as the maximum of the second derivative of the voltage in the range between the minimum between two peaks and the next peak',
    AP_begin_width: 'Width of spike at spike start',
    AP1_begin_width: 'Width of spike at spike start',
    AP2_begin_width: 'Width of spike at spike start',
    AP2_AP1_begin_width_diff: 'Difference width of the second to first spike',
    AP_begin_voltage: 'Voltage at spike start',
    AP1_begin_voltage: 'Voltage at spike start',
    AP2_begin_voltage: 'Voltage at spike start',
    AP_begin_time:
      'Time at spike start. Spike start is defined as where the first derivative of the voltage trace is higher than 10 V/s , for at least 5 points',
    AP_peak_upstroke: 'Maximum of rise rate of spike',
    AP_peak_downstroke: 'Minimum of fall rate from spike',
    AP_rise_time:
      'Time between the AP threshold and the peak, given a window (default: from 0% to 100% of the AP amplitude)',
    AP_fall_time: 'Time from action potential maximum to the offset',
    AP_rise_rate: 'Voltage change rate during the rising phase of the action potential',
    AP_fall_rate: 'Voltage change rate during the falling phase of the action potential',
    AP_rise_rate_change:
      'Difference of the rise rates of the second and the first action potential divided by the rise rate of the first action potential',
    AP_fall_rate_change:
      'Difference of the fall rates of the second and the first action potential divided by the fall rate of the first action potential',
    AP_phaseslope:
      'Slope of the V, dVdt phasespace plot at the beginning of every spike\n(at the point where the derivative crosses the DerivativeThreshold)',
    AP_phaseslope_AIS:
      'Same as AP_phaseslope, but for AIS location\nPlease, notice that you have to provide t, v, stim_start and stim_end for location.',
    BPAPHeightLoc1:
      'Voltage height (difference betwen peaks and voltage base) at dendrite location\nPlease, notice that you have to provide t, v, stim_start and stim_end for location.',
    BPAPHeightLoc2: 'Same as BPAPHeightLoc1, but for dend2 location',
    BPAPAmplitudeLoc1:
      'Amplitude at dendrite location\nPlease, notice that you have to provide t, v, stim_start and stim_end for location.',
    BPAPAmplitudeLoc2: 'Same as BPAPAmplitudeLoc1, but for dend2 location',
    BAC_width:
      'AP width at epsp location\nPlease, notice that you have to provide t, v, stim_start and stim_end for location.',
    BAC_maximum_voltage:
      'Maximuum voltage at epsp location\nPlease, notice that you have to provide t, v, stim_start and stim_end for location.',
  },
  Voltage: {
    steady_state_voltage_stimend:
      'The average voltage during the last 10% of the stimulus duration.',
    steady_state_hyper:
      'Steady state voltage during hyperpolarization for 30 data points (after interpolation)',
    steady_state_voltage: 'The average voltage after the stimulus',
    voltage_base: 'The average voltage during the last 10% of time before the stimulus.',
    current_base: 'The average current during the last 10% of time before the stimulus.',
    time_constant:
      'The membrane time constant\nThe extraction of the time constant requires a voltage trace of a cell in a hyper- polarized state. Starting at stim start find the beginning of the exponential decay where the first derivative of V(t) is smaller than -0.005 V/s in 5 subsequent points. The flat subsequent to the exponential decay is defined as the point where the first derivative of the voltage trace is bigger than -0.005 and the mean of the follwowing 70 points as well. If the voltage trace between the beginning of the decay and the flat includes more than 9 points, fit an exponential decay. Yield the time constant of that decay.',
    decay_time_constant_after_stim:
      'The decay time constant of the voltage right after the stimulus',
    multiple_decay_time_constant_after_stim:
      'When multiple stimuli are applied, this function returns a list of decay time constants each computed on the voltage right after each stimulus.\nThe settings multi_stim_start and multi_stim_end are mandatory for this feature to work. Each is a list containing the start and end times of each stimulus present in the current protocol respectively.',
    sag_time_constant:
      'The decay time constant of the exponential voltage decay from the bottom of the sag to the steady-state.\nThe start of the decay is taken at the minimum voltage (the bottom of the sag). The end of the decay is taken when the voltage crosses the steady state voltage minus 10% of the sag amplitude. The time constant is the slope of the linear fit to the log of the voltage. The golden search algorithm is not used, since the data is expected to be noisy and adding a parameter in the log ( log(voltage + x) ) is likely to increase errors on the fit.',
    sag_amplitude: 'The difference between the minimal voltage and the steady state at stimend',
    sag_ratio1: 'The ratio between the sag amplitude and the maximal sag extend from voltage base',
    sag_ratio2: 'The ratio between the maximal extends of sag from steady state and voltage base',
    ohmic_input_resistance: 'The ratio between the voltage deflection and stimulus current',
    ohmic_input_resistance_vb_ssse:
      'The ratio between the voltage deflection (between voltage base and steady-state voltage at stimend) and stimulus current',
    voltage_deflection_vb_ssse:
      'The voltage deflection between voltage base and steady-state voltage at stimend\nThe voltage base used is the average voltage during the last 10% of time before the stimulus and the steady state voltage at stimend used is the average voltage during the last 10% of the stimulus duration.',
    voltage_deflection:
      'The voltage deflection between voltage base and steady-state voltage at stimend\nThe voltage base used is the average voltage during all of the time before the stimulus and the steady state voltage at stimend used is the average voltage of the five values before the last five values before the end of the stimulus duration.',
    voltage_deflection_begin:
      'The voltage deflection between voltage base and steady-state voltage soon after stimulation start\nThe voltage base used is the average voltage during all of the time before the stimulus and the steady state voltage used is the average voltage taken from 5% to 15% of the stimulus duration.',
    voltage_after_stim:
      'The mean voltage after the stimulus in (stim_end + 25%*end_period, stim_end + 75%*end_period)',
    minimum_voltage: 'The minimum of the voltage during the stimulus',
    maximum_voltage: 'The maximum of the voltage during the stimulus',
    maximum_voltage_from_voltagebase:
      'Difference between maximum voltage during stimulus and voltage base',
    depol_block_bool: '',
  },
};

export const eCodesDocumentationUrl =
  'https://bbpteam.epfl.ch/project/spaces/display/DBPROTOCOL/Ecode';
