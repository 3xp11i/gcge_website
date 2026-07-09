export type RegionOption = 'India' | 'International'

export const regionOptions: RegionOption[] = ['India', 'International']

export const useRegionSelection = () => {
  const selectedRegion = useState<RegionOption>('selected-region', () => 'India')
  const regionInitialized = useState<boolean>('selected-region-initialized', () => false)

  const persistRegion = (region: RegionOption) => {
    if (!import.meta.client) {
      return
    }

    const storedRegion = useLocalStorage<RegionOption>('selectedRegion', 'India')
    storedRegion.value = region
  }

  const initRegion = async () => {
    if (!import.meta.client || regionInitialized.value) {
      return
    }

    const storedRegion = useLocalStorage<RegionOption | null>('selectedRegion', null)

    if (storedRegion.value === 'India' || storedRegion.value === 'International') {
      selectedRegion.value = storedRegion.value
      regionInitialized.value = true
      return
    }

    try {
      const response = await $fetch<{ country_name: string }>('https://ipapi.co/json/')
      selectedRegion.value = response.country_name === 'India' ? 'India' : 'International'
    } catch {
      selectedRegion.value = 'India'
    }

    persistRegion(selectedRegion.value)
    regionInitialized.value = true
  }

  return {
    selectedRegion,
    initRegion,
    persistRegion,
  }
}