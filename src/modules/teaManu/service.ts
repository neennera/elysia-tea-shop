// Service handle business logic, decoupled from Elysia controller
import { status } from "elysia";
import { TeaManuModel } from "./model";
import { PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient();

export abstract class TeaManuService {
  static async TeaManus() {
    const teas = await prisma.teaManu.findMany();
    console.log(teas);

    return {
      data: teas,
    };
  }
  static async TeaManu(id: number) {
    return {
      data: `manu ${id}`,
    };
  }
  static async newTeaManu({ name, price }: TeaManuModel.NewTeaManuBody) {
    return {
      id: "new id ja",
      name,
      price,
    };
  }
  static async RemoveTeaManu(id: number) {
    return {
      data: `deleted manu ${id}`,
    };
  }
  static async UpdateTeaManu({
    id,
    name,
    price,
  }: TeaManuModel.TeaManuBodyType) {
    return {
      id: id,
      name,
      price,
    };
  }
}
