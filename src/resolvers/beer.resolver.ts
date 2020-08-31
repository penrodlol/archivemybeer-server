import { Resolver, Query } from "type-graphql";
import { Beer } from "../entity/beer.entity";

@Resolver()
export class BeerResolver {
    @Query(() => [Beer])
    beers() {
        return Beer.find();
    }
}
