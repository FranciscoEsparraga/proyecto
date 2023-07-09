import React, { useState, useEffect } from "react";
import { categories } from "../config";

// const Search = ({ onSearch, categories }) => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const { get } = useServer();

//   const fetchServiceByType = async (type) => {
//     console.log("Vamos a buscar ", type);
//     try {
//       const { data } = await get({ url: `/service/type/video` });
//       console.log("data");
//       console.log(data);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useEffect(() => {
//     fetchServiceByType(selectedCategory);
//   }, [selectedCategory]);

//   const handleSelectChange = (event) => {
//     setSelectedCategory(event.target.value);
//   };

//   const handleSearch = (e) => {
//     console.log(e.target);
//     onSearch(selectedCategory);
//   };

//   return (
//     <div className="search-bar">
//       <select value={selectedCategory} onChange={handleSelectChange}>
//         {categories.map((category, index) => (
//           <option key={index} value={category}>
//             {category}
//           </option>
//         ))}
//       </select>
//       <button onClick={(e) => handleSearch(e)} className="search-button">
//         Buscar
//       </button>
//     </div>
//   );
// };

// const SearchBar = () => {
//   const [services, setServices] = useState([]);

//   // useEffect(() => {
//   //   // Realizar la solicitud POST para obtener los servicios y sus categorías
//   //   fetch("URL_DE_TU_API", {
//   //     method: "POST",
//   //     // Agregar cualquier encabezado o cuerpo de solicitud necesario
//   //   })
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       // Actualizar la lista de servicios en el estado
//   //       setServices(data.services);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error al obtener los servicios:", error);
//   //     });
//   // }, []);

//   const [filteredServices, setFilteredServices] = useState([]);

//   const handleSearch = (selectedCategory) => {
//     if (selectedCategory === "Todos los servicios") {
//       setFilteredServices(services);
//     } else {
//       const filtered = services.filter(
//         (service) => service.categoria === selectedCategory
//       );
//       setFilteredServices(filtered);
//     }
//   };

//   return (
//     <div>
//       <Search categories={categories} onSearch={handleSearch} />
//       <ul>
//         {filteredServices.map((service, index) => (
//           <li key={index}>{service.nombre}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchBar;

function SearchBar({ filterServices }) {
  const [currentService, setCurrentService] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("currentService");
    // console.log(currentService);

    filterServices(currentService);
  };

  const requestService = (e) => {
    setCurrentService(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <select onChange={requestService}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button
        className="publish-comment text-white font-bold py-2 px-4 rounded content-center bg-indigo-500 hover:bg-indigo-700"
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;
