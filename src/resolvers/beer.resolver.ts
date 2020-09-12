import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ObjectID } from "mongodb";
import { BeerPayload } from '../inputs/beer.input';
import { Beer } from "../entity/beer.entity";
import { S3Util } from "../utils/s3.util";

@Resolver()
export class BeerResolver {
    s3Utils = new S3Util();

    @Query(() => [Beer])
    async beers() {
        return (await Beer.find()).map(beer => ({
            ...beer,
            image_url: this.s3Utils.getImageUrl(`${beer.image}`)
        }));
    }

    @Query(() => Beer)
    async beer(@Arg('_id', () => String) id: string) {
        const beer = await Beer.findOne({ where: new ObjectID(id) });
        return {
            ...beer,
            image_url: this.s3Utils.getImageUrl(`${beer?.image}`)
        }
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
    async delete(@Arg('id', () => String) id: string) {
        await Beer.delete({ _id: new ObjectID(id) });
        return id;
    }
}
