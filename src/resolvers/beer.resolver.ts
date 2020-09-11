import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ObjectID } from "mongodb";
import { BeerPayload } from '../inputs/beer.input';
import { Beer } from "../entity/beer.entity";
import { GraphQLUpload } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { FileUpload } from "graphql-upload";
import { GridFSUtil } from "../utils/gridfs";

@Resolver()
export class BeerResolver {
    gridFSUtil: GridFSUtil = new GridFSUtil();

    @Query(() => [Beer])
    beers() {
        return Beer.find();
    }

    @Query(() => Beer)
    beer(@Arg('_id', () => String) id: string) {
        return Beer.findOne({ where: new ObjectID(id) });
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

    @Mutation(() => String)
    async uploadImage(@Arg('file', () => GraphQLUpload as GraphQLScalarType) fileUpload: FileUpload) {
        return this.gridFSUtil.upload(fileUpload);
    }
}
