import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class BeerPayload {
    @Field({ nullable: false })
    @Length(1, 200)
    name: string;
    
    @Field({ nullable: false })
    @Length(1, 200)
    brewer: string;
    
    @Field({ nullable: false })
    @Length(1, 200)
    style: string;
    
    @Field({ nullable: false })
    @Length(1, 200)
    city: string;
    
    @Field({ nullable: false })
    @Length(1, 200)
    state: string;
    
    @Field({ nullable: false })
    @Length(1, 200)
    country: string; 
}