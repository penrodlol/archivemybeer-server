import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ObjectID } from "mongodb";
import { BeerPayload } from '../inputs/beer.input';
import { Beer } from "../entity/beer.entity";

@Resolver()
export class BeerResolver {
    @Query(() => [Beer])
    beers() {
        return Beer.find();
    }

    @Mutation(() => Beer)
    async add(@Arg('beer', () => BeerPayload) beer: BeerPayload) {
        return await Beer.create(beer).save();
    }

    @Mutation(() => Beer)
    async update
    (
        @Arg('id', () => String) id: string,
        @Arg('beer', () => BeerPayload) beer: BeerPayload
    ) {
        const _id = new ObjectID(id);

        await Beer.update({ _id }, beer);
        return Beer.findOne({ _id });
    }

    @Mutation(() => String)
    async remove(@Arg('id', () => String) id: string) {
        await Beer.delete({ _id: new ObjectID(id) });
        return id;
    }
}
