import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui";

function HomePage() {
  //Mejor practica pra no imortar tanto authcontexy como AuthProvider por separado
  const data = useAuth();
  console.log(data);
  return (
    <div>
      <Card>
        <h1 className="text-3xl font-bold my-4">Home Page</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores,
          fuga! Debitis nesciunt amet nihil rerum eaque quae iusto odio
          consequuntur mollitia, cumque minima corporis eveniet alias dicta
          delectus sequi id?
        </p>
      </Card>
    </div>
  );
}

export default HomePage;
