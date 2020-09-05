import {Entity, BaseEntity, Column, ObjectIdColumn } from "typeorm"; 
import { ObjectType, Field, ID } from "type-graphql";
import { ObjectID } from "mongodb";

@ObjectType()
@Entity() 
export class Image extends BaseEntity {     
    @Field(() => ID) 
    @ObjectIdColumn()
    _id: ObjectID;

    @Field()
    @Column()
    src: string;
}
