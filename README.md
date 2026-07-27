# Todo on 28 July 2026


## Slot Booking process
- Generate Slots in Supabase (Build logic for Supabase Cron to generate default slots, design the system to properly handle different duration slots and generate them in that order)
- Fetch Slots in Birth Details Form + Build Slots Selection UI (with slot list boxes, a selection functionality, a confirm button to check the availability of the slot and change the status of the slot)
- Add the metadata of the Slot (slot_id) in both Payment providers
- In the Webhook Receival API Endpoints, after creating new consultation, get the consultation id and set the respective slot's consultation_id column as that.



## Admin Dashboard
- Using AI create a document, copy the theme and other required packages like Nuxt UI 

- Build Admin UI, host on admin.galacticgene.com with Supabase Auth.


- List All Slots, 