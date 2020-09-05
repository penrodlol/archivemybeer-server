import { Entity, Column, BaseEntity, ObjectIdColumn } from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { ObjectID } from "mongodb";

@ObjectType()
@Entity()
export class Beer extends BaseEntity {
    @Field(() => ID) 
    @ObjectIdColumn()
    _id: ObjectID;

    @Field()
    @Column('varchar', { length: 200 })
    name: string;

    @Field()
    @Column('varchar', { length: 200 })
    brewer: string;

    @Field()
    @Column('varchar', { length: 200 })
    style: string;

    @Field()
    @Column('varchar', { length: 200 })
    city: string;

    @Field()
    @Column('varchar', { length: 200 })
    state: string;

    @Field()
    @Column('varchar', { length: 200 })
    country: string;
}
