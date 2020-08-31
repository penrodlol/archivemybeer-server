import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Beer extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

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
