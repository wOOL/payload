// src/collections/Orders/hooks/updateUserBalance.ts

import type { AfterChangeHook } from 'payload/dist/collections/config/types'
import type { Order, Product, User } from '../../../payload-types'

export const updateUserBalance: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  const { payload } = req

  console.log('updateUserBalance hook triggered', { operation, docId: doc.id });

  // Check if the order has a stripePaymentIntentID, which indicates a successful payment
  if (doc.stripePaymentIntentID) {
    console.log('Stripe payment detected', { stripePaymentIntentID: doc.stripePaymentIntentID });

    const orderedBy = typeof doc.orderedBy === 'object' ? doc.orderedBy.id : doc.orderedBy

    if (orderedBy) {
      console.log('Fetching user', { orderedBy });

      const user = await payload.findByID({
        collection: 'users',
        id: orderedBy,
      }) as User | null

      if (user) {
        console.log('User found', { userId: user.id, currentBalance: user.balance });

        let balanceIncrease = 0

        // Iterate through purchased products
        if (doc.items) {
          for (const item of doc.items) {
            const productId = typeof item.product === 'object' ? item.product.id : item.product
            const product = await payload.findByID({
              collection: 'products',
              id: productId,
            }) as Product | null

            if (product) {
              console.log('Processing product', { productSlug: product.slug });

              if (product.slug === '100-tokens') {
                balanceIncrease += 100* (item.quantity || 1)
              } else if (product.slug === '220-tokens') {
                balanceIncrease += 220* (item.quantity || 1)
              }
            }
          }
        }

        console.log('Balance increase calculated', { balanceIncrease });

        // Update user balance
        if (balanceIncrease > 0) {
          const updatedUser = await payload.update({
            collection: 'users',
            id: orderedBy,
            data: {
              balance: ((user.balance as number) || 0) + balanceIncrease,
            },
          })

          console.log('User balance updated', { 
            userId: updatedUser.id, 
            oldBalance: user.balance, 
            newBalance: updatedUser.balance 
          });
        } else {
          console.log('No balance increase needed');
        }
      } else {
        console.log('User not found', { orderedBy });
      }
    } else {
      console.log('No orderedBy found in the document');
    }
  } else {
    console.log('No Stripe payment detected, skipping balance update');
  }

  return
}
