import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { BeerPayload } from '../inputs/beer.input';
import { Beer } from "../entity/beer.entity";

@Resolver()
export class BeerResolver {
    @Query(() => [Beer])
    beers() {
        return Beer.find();
    }

    @Mutation(() => Beer)
    async addBeer(@Arg('beer', () => BeerPayload) beer: BeerPayload) {
        return await Beer.create(beer).save();
    }
}
