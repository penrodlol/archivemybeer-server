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
    @Column('varchar', { length: 200, nullable: false })
    name: string;

    @Field()
    @Column('varchar', { length: 200, nullable: false })
    brewer: string;

    @Field()
    @Column('varchar', { length: 200, nullable: false })
    style: string;

    @Field()
    @Column('varchar', { length: 200, nullable: false })
    city: string;

    @Field()
    @Column('varchar', { length: 200, nullable: false })
    state: string;

    @Field()
    @Column('varchar', { length: 200, nullable: false  })
    country: string;

    @Field()
    @Column('varchar', { nullable: false  })
    image: string;

    @Field()
    image_url: string;
}
