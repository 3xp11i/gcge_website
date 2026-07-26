<template>
  <div>
    <PurchaseButton label="Buy This Course"
                    :loading="checkout.loading.value"
                    :status-message="checkout.statusMessage.value"
                    :error-message="checkout.errorMessage.value"
                    @click="purchase.openForm(course.id)" />

    <UModal v-model:open="purchase.formOpen.value"
            @close:prevent="purchase.closeForm"
            title="Enter Your Details"
            description="Please provide your details to proceed with the course enrollment."
            class="rounded-2xl"
            scrollable
            :ui="{ header: 'bg-black/20 rounded-t-2xl py-8', title: 'text-3xl! font-semibold' }">
      <template #body>
        <StudentDetailsForm :key="purchase.formKey.value"
                            submit-label="Continue to Payment"
                            @submit="handleStudentDetailsSubmit"
                            @cancel="purchase.closeForm" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { StudentDetails } from '~/shared/types/form.types'
import type { CourseProduct } from '~/shared/utils/dodoProducts';


const props = defineProps<{
  course: CourseProduct
}>()

const { selectedRegion } = useRegionSelection()
const runtimeConfig = useRuntimeConfig()

const purchase = usePurchaseFlow<StudentDetails>()
const checkout = usePaymentCheckout()

const isDodoLiveMode = computed(() => {
  const mode = String(runtimeConfig.public.dodoMode || 'test').toLowerCase()
  return mode === 'live' || mode === 'live_mode'
})

const dodoProductId = computed(() =>
  isDodoLiveMode.value
    ? props.course.dodoProductIDLive || props.course.dodoProductID
    : props.course.dodoProductID
)

function handleStudentDetailsSubmit(details: StudentDetails) {
  purchase.submitForm(details)
}

watch(
  () => [purchase.formData.value, purchase.activeItemId.value] as const,
  ([details, itemId]) => {
    if (!details || !itemId || itemId !== props.course.id) return
    purchase.consumeActiveItem()

    const metadata = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      experience: details.experience,
      courseId: props.course.id,
      courseTitle: props.course.title,
      orderType: 'course',
    }

    checkout.startCheckout({
      provider: selectedRegion.value === 'India' ? 'razorpay' : 'dodo',
      amountPaise: props.course.amountPaise,
      amountUsd: props.course.priceUsd,
      dodoProductId: dodoProductId.value,
      description: props.course.title,
      receipt: `course_${props.course.id}_${Date.now()}`,
      customerName: `${details.firstName} ${details.lastName}`,
      customerEmail: details.email,
      metadata,
      onSuccess: () => {
        purchase.resetAfterSuccess()
        window.location.reload()
      },
      onDismiss: () => {
        // keep formData for retry, same as consultation flow
      },
    })
  }
)
</script>