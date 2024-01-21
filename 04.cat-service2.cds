using { ns as my } from '../db/schema2';

service CatalogService {
    entity Orders as projection on my.Orders;
    @readonly
    entity Products as projection on my.Products; 
}
