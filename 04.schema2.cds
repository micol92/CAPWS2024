namespace ns;
entity Orders {
  key ID : String(5);
  owner : String(100);
  products : Association to Products;
}

using {NorthWind as external} from '../srv/external/NorthWind.csn';
entity Products as projection on external.Products {
    key ID, Name, Description, ReleaseDate, DiscontinuedDate, Rating, Price
};
