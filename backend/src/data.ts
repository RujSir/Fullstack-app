import { faker } from "@faker-js/faker";

export interface User {
  id: number;
  name: string;
  email: string;
  createAt: string;
}
export interface Product {
  id: number;
  name: string;
  price: number;
}
export interface Order {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  amount: number;
  createAt: string;
}

export interface UserSummary {
  orderCount: number;
  orderTotal: number;
}

export const users: User[] = [];
export const orders: Order[] = [];
export const userSummaries = new Map<number, UserSummary>();
export const products: Product[] = [];

export function seedData(userCount: number, ordersCount: number) {
  users.length = 0;
  orders.length = 0;
  products.length = 0;
  userSummaries.clear();

  for (let i = 1; i <= userCount; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      createAt: faker.date.past().toISOString(),
    });
    userSummaries.set(i, { orderCount: 0, orderTotal: 0 });
  }

  for (let i = 1; i <= 100; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 1, max: 100 }),
    });
  }

  for (let i = 1; i <= ordersCount; i++) {
    const userId = faker.number.int({ min: 1, max: userCount });
    const product =
      products[faker.number.int({ min: 0, max: products.length - 1 })];
    const amount = faker.number.int({ min: 1, max: 5 });
    const orderTotal = product.price * amount;

    orders.push({
      id: i,
      userId,
      productId: product.id,
      productName: product.name,
      amount,
      createAt: faker.date.past().toISOString(),
    });

    const summary = userSummaries.get(userId)!;
    summary.orderCount++;
    summary.orderTotal += orderTotal;
  }

  console.log(
    `Users: ${users.length} | Orders: ${orders.length} | Products: ${products.length}`
  );
}
