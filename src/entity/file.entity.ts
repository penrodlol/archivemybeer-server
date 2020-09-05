import { BaseEntity, Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { ObjectID } from "mongodb";

@ObjectType()
@Entity()
export class File extends BaseEntity {
    @Field(() => ID) 
    @ObjectIdColumn()
    _id: ObjectID;

    @Field()
    @Column()
    filename: string;

    @Field()
    @Column()
    mimetype: string;

    @Field()
    @Column()
    encoding: string;

}
