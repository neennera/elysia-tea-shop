// Service handle business logic, decoupled from Elysia controller
import { status } from "elysia";
import { TeaManuModel } from "./model";
import { PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient();

export abstract class TeaManuService {
  // get all tea manus
  static async TeaManus() {
    try {
      const teas = await prisma.teaManu.findMany();
      return {
        data: teas,
      };
    } catch (error) {
      return status(500, { message: "Failed to fetch tea menu items" });
    }
  }

  // get one tea manus
  static async TeaManu(id: string) {
    try {
      const tea = await prisma.teaManu.findFirst({
        where: {
          id: id.toString(),
        },
      });

      if (!tea) return status(404, { message: "Tea id not found" });

      return {
        data: tea,
      };
    } catch (error) {
      return status(500, { message: "Failed to fetch tea menu item" });
    }
  }

  // create new tea manu
  static async newTeaManu({ name, price }: TeaManuModel.NewTeaManuBody) {
    try {
      const newTeaManu = await prisma.teaManu.create({
        data: {
          name,
          price,
        },
      });
      return {
        id: newTeaManu.id,
      };
    } catch (error) {
      return status(500, { message: "Failed to create tea menu item" });
    }
  }

  // delete tea manu by tea id
  static async RemoveTeaManu(id: string) {
    try {
      const deleted = await prisma.teaManu.delete({
        where: { id },
      });

      return {
        data: `Deleted tea menu item: ${deleted.name}`,
      };
    } catch (error) {
      return status(404, { message: "Tea not found or couldn't be deleted" });
    }
  }

  // update tea data
  static async UpdateTeaManu({
    id,
    name,
    price,
  }: TeaManuModel.TeaManuBodyType) {
    try {
      const updated = await prisma.teaManu.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(price !== undefined && { price }),
        },
      });
      return {
        data: `updated tea manu ${id}`,
      };
    } catch (error: any) {
      // More specific error handling
      if (error.code === "P2025") {
        return status(404, { message: "Tea not found" });
      }
      return status(500, { message: "Failed to update tea menu item" });
    }
  }
}
