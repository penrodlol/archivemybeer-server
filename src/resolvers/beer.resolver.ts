import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ObjectID } from "mongodb";
import { BeerPayload } from '../inputs/beer.input';
import { Beer } from "../entity/beer.entity";
import { S3Util } from "../utils/s3.util";
import { ApolloError, GraphQLUpload } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { Errors } from "../enums/errors.enum";
import { Upload } from "../entity/upload.entity";

@Resolver()
export class BeerResolver {
    s3Utils = new S3Util();

    @Query(() => [Beer])
    async beers() {
        return Beer
            .find()
            .then(beers => beers.length > 0 ?
                beers.map(beer => ({
                    ...beer,
                    image_url: this.s3Utils.getUrl(`${beer.image}`)}
                )) :
                [],
            )
            .catch(() => new ApolloError(Errors.BeersRetrievalFailure))
    }

    @Query(() => Beer)
    async beer(@Arg('_id', () => String) id: string) {
        return Beer
            .findOne({ where: new ObjectID(id) })
            .then(beer => beer ? 
                { ...beer, image_url: this.s3Utils.getUrl(beer.image) } :
                new Error(Errors.BeerRetrievalFailure)
            )
            .catch(() => new ApolloError(Errors.BeerRetrievalFailure));
    }

    @Mutation(() => Beer)
    add(@Arg('beer', () => BeerPayload) beer: BeerPayload) {
        return Beer.create(beer).save();
    }

    @Mutation(() => Beer)
    async update
    (
        @Arg('id', () => String) id: string,
        @Arg('beer', () => BeerPayload) beer: BeerPayload,
        @Arg('file', () => GraphQLUpload as GraphQLScalarType, { nullable: true }) file: Upload,
    ) {
        const imageUpload = file ? await this.s3Utils.upload(file) : null;
        const _id = new ObjectID(id);

        return Beer
            .update({ _id }, imageUpload ? { ...beer, image: imageUpload.key } : { ...beer })
            .then(() => ({ _id, ...beer, image_url: imageUpload ? imageUpload.url : '' }))
            .catch(() => new ApolloError(Errors.BeerUpdateFailure));
    }

    @Mutation(() => Boolean)
    async delete(
        @Arg('id', () => String) id: string,
        @Arg('image', () => String) image: string,
    ) {
        await this.s3Utils.delete(image);
        return Beer
            .delete({ _id: new ObjectID(id) })
            .then(() => true)
            .catch(() => new ApolloError(Errors.BeerDeleteFailure));
    }

}
