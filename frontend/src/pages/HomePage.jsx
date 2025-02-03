import { useAuth } from "../context/AuthContext";

function HomePage() {
  //Mejor practica pra no imortar tanto authcontexy como AuthProvider por separado
  const data = useAuth();
  console.log(data);
  return <div>HomePage</div>;
}

export default HomePage;
