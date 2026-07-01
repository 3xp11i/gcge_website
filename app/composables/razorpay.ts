import Razorpay from "razorpay";

export const useRazorpay = () => {
  return ref(new Razorpay({ key_id: useRuntimeConfig().public.razorpayKeyId, key_secret: useRuntimeConfig().razorpayKeySecret }));
}
