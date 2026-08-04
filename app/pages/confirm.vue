<template>
	<div class="min-h-[80vh]">
		<h4>Waiting for login...</h4>
	</div>
</template>

<script setup lang="ts">


const user = useSupabaseUser();

watch(
	user,
	() => {
		if (user.value) {
			// Redirect to protected page
			return navigateTo("/");
		}
	},
	{ immediate: true },
);
</script>
