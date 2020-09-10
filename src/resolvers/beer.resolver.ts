import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ObjectID, MongoClient, GridFSBucket } from "mongodb";
import { BeerPayload } from '../inputs/beer.input';
import { Beer } from "../entity/beer.entity";
import { GraphQLUpload } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import { FileUpload } from "graphql-upload";
import { getConnection } from "typeorm";

@Resolver()
export class BeerResolver {
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

    @Mutation(() => Boolean)
    async uploadImage(@Arg('file', () => GraphQLUpload as GraphQLScalarType) file: FileUpload) {
        const client = (getConnection().driver as any).queryRunner.databaseConnection as MongoClient;
        const gridfs = new GridFSBucket(client.db());

        return new Promise((resolve, reject) => {
            file.createReadStream()
                .pipe(gridfs.openUploadStream(file.filename))
                .on('finish', () => resolve(true))
                .on('error', (err) => {
                    console.log(err);
                    reject(false);
                });
        });
    }
}
