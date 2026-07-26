export function usePurchaseFlow<TFormData>() {
	const formOpen = ref(false);
	const formData = ref<TFormData | null>(null);
	const activeItemId = ref<string | null>(null);
	const formKey = ref(0);

	function openForm(itemId: string) {
		formData.value = null;
		activeItemId.value = itemId;
		formKey.value++;
		formOpen.value = true;
	}

	function closeForm() {
		formOpen.value = false;
		formData.value = null;
		activeItemId.value = null;
		formKey.value++;
	}

	function submitForm(details: TFormData) {
		formData.value = details;
		formOpen.value = false;
	}

	// call once you've consumed activeItemId to start a checkout,
	// so the watcher below doesn't refire for the same submission
	function consumeActiveItem() {
		activeItemId.value = null;
	}

	function resetAfterSuccess() {
		formData.value = null;
		activeItemId.value = null;
		formKey.value++;
	}

	return {
		formOpen,
		formData,
		activeItemId,
		formKey,
		openForm,
		closeForm,
		submitForm,
		consumeActiveItem,
		resetAfterSuccess,
	};
}
