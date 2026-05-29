import { z } from 'zod';



export const orderStatusSchema = z.enum([

  'pending_payment',

  'confirmed',

  'ready_for_pickup',

  'collected',

  'fulfilled',

  'shipped',

  'delivered',

]);



export type OrderStatus = z.infer<typeof orderStatusSchema>;



export const billingAddressSchema = z.object({

  name: z.string().min(1),

  addressLine1: z.string().min(1),

  addressLine2: z.string().optional(),

  city: z.string().min(1),

  countyOrRegion: z.string().min(1),

  postcode: z.string().min(1),

  country: z.string().min(1),

});



export const shippingAddressSchema = z.object({

  recipientName: z.string().min(1, 'Recipient name is required'),

  addressLine1: z.string().min(1, 'Address line 1 is required'),

  addressLine2: z.string().optional(),

  city: z.string().min(1, 'City is required'),

  countyOrRegion: z.string().optional(),

  postcode: z.string().min(1, 'Postcode is required'),

  country: z.string().min(1, 'Country is required'),

});



export const deliveryOptionSchema = z.discriminatedUnion('type', [

  z.object({

    type: z.literal('standard_delivery'),

    shippingCostPence: z.number().int().positive(),

    estimatedDeliveryWindow: z.string(),

  }),

  z.object({

    type: z.literal('click_and_collect'),

    pickupStoreCode: z.string().min(1).optional(),

  }),

]);



const guestCheckoutBaseSchema = z.object({

  guestEmail: z.string().email(),

  guestName: z.string().min(1),

  billingAddress: billingAddressSchema,

  pickupStoreCode: z.string().min(1).optional(),

  deliveryOption: deliveryOptionSchema.optional(),

  shippingAddress: shippingAddressSchema.optional(),

});



export const guestCheckoutSchema = guestCheckoutBaseSchema.superRefine((data, ctx) => {

  if (data.pickupStoreCode && !data.deliveryOption) {

    return;

  }



  if (!data.deliveryOption) {

    ctx.addIssue({ code: 'custom', message: 'delivery option is required', path: ['deliveryOption'] });

    return;

  }



  if (data.deliveryOption.type === 'standard_delivery') {

    if (!data.shippingAddress) {

      ctx.addIssue({

        code: 'custom',

        message: 'Shipping address incomplete',

        path: ['shippingAddress'],

      });

    }

    return;

  }



  const storeCode = data.deliveryOption.pickupStoreCode ?? data.pickupStoreCode;

  if (!storeCode) {

    ctx.addIssue({

      code: 'custom',

      message: 'pickup store is required',

      path: ['pickupStoreCode'],

    });

  }

});



export const orderLineItemSchema = z.object({

  sku: z.string(),

  name: z.string(),

  price: z.string(),

  quantity: z.number().int().positive(),

  lineTotal: z.number(),

});



export const pickupStoreDtoSchema = z.object({

  storeCode: z.string(),

  storeName: z.string(),

  addressLineOne: z.string(),

  city: z.string(),

  postcode: z.string(),

});



export const orderDtoSchema = z.object({

  orderNumber: z.string(),

  status: orderStatusSchema,

  guestEmail: z.string(),

  guestName: z.string(),

  billingAddress: billingAddressSchema,

  pickupStore: pickupStoreDtoSchema.optional(),

  shippingAddress: shippingAddressSchema.optional(),

  deliveryOption: deliveryOptionSchema.optional(),

  items: z.array(orderLineItemSchema),

  subtotal: z.number(),

  subtotalFormatted: z.string(),

  shippingCostPence: z.number().optional(),

  shippingCostFormatted: z.string().optional(),

  estimatedDeliveryWindow: z.string().optional(),

  deliveryTypeLabel: z.string().optional(),

  stockWarnings: z.array(z.object({ sku: z.string(), message: z.string() })).optional(),

  emailStatus: z.enum(['sent', 'queued', 'failed']).optional(),

  maskedPaymentMethod: z.string().optional(),

  processingVendor: z.enum(['stripewave', 'paynova', 'vaultpay']).optional(),

  vendorTransactionReference: z.string().optional(),

  automaticPaymentRetryInProgress: z.boolean().optional(),

  savePayNovaWalletOffered: z.boolean().optional(),

  statusPageUrl: z.string().optional(),

  trackingNumber: z

    .object({

      value: z.string(),

      carrierName: z.string(),

      carrierTrackingUrl: z.string().optional(),

    })

    .optional(),

  shippedAt: z.string().optional(),

  estimatedDeliveryDate: z.string().optional(),

});



export const orderStatusDtoSchema = z.object({

  orderNumber: z.string(),

  status: orderStatusSchema,

  statusLabel: z.string(),

  deliveryOptionLabel: z.string(),

  guestEmail: z.string(),

  lineItems: z.array(orderLineItemSchema),

  shippingAddress: shippingAddressSchema.optional(),

  pickupStore: pickupStoreDtoSchema.optional(),

  shippingCostFormatted: z.string().optional(),

  estimatedDeliveryWindow: z.string().optional(),

  tracking: z

    .object({

      number: z.string(),

      carrierName: z.string(),

      carrierTrackingUrl: z.string(),

      shippedAt: z.string(),

      estimatedDeliveryDate: z.string().optional(),

    })

    .optional(),

  trackingPendingMessage: z.string().optional(),

});



export const guestOrderLookupSchema = z.object({

  orderNumber: z.string().min(1),

  guestEmail: z.string().email(),

});



export const fulfillOrderSchema = z.object({

  carrierName: z.string().optional(),

  trackingNumber: z.string().optional(),

});



export const addTrackingSchema = z.object({

  carrierName: z.string().min(1),

  trackingNumber: z.string().min(1),

});



export type BillingAddress = z.infer<typeof billingAddressSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type GuestCheckoutInput = z.infer<typeof guestCheckoutSchema>;

export type OrderDto = z.infer<typeof orderDtoSchema>;

export type OrderStatusDto = z.infer<typeof orderStatusDtoSchema>;

export type OrderLineItem = z.infer<typeof orderLineItemSchema>;

export type DeliveryOptionInput = z.infer<typeof deliveryOptionSchema>;


