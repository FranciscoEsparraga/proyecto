import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useServer from "../../hooks/useServer";
import "./style.css";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [servicesAvailables, setServicesAvailables] = useState(false);
  const [filteredServices, setFilteredServices] = useState("");
  const [prueba, setPrueba] = useState();
  const { get } = useServer();

  const handleClick = (currentService) => {
    setFilteredServices(currentService);
    setPrueba(currentService);
  };

  const fetchAllServices = async () => {
    try {
      const resp = await fetch(`http://localhost:3000/service`);
      const { serviceData: data } = await resp.json();

      if (typeof data === "object") {
        const service = data.map((s) => ({
          id: s.id,
          title: s.title,
          request_body: s.request_body,
          service_type: s.service_type,
          user_id: s.user_id,
          done: s.done,
          creation_date: s.creation_date.split("T")[0],
        }));
        setServices(service);
        setFilteredServices(service);
        setServicesAvailables(true);
      }
    } catch (e) {
      console.log("Error getting services: ", e);
    }
  };

  const fetchFilterServices = async () => {
    try {
      const { data } = await get({
        url: `/service/type/${prueba}`,
      });

      if (typeof data.serviceData === "object") {
        const service = data.serviceData.map((s) => ({
          id: s.id,
          title: s.title,
          request_body: s.request_body,
          service_type: s.service_type,
          user_id: s.user_id,
          done: s.done,
          creation_date: s.creation_date.split("T")[0],
        }));
        setServices(service);
        setServicesAvailables(true);
      }
    } catch (e) {
      console.log("Error getting services: ", e);
    }
  };

  // useEffect(() => {
  //   if (filteredServices === "Todos los servicios") {
  //     console.log("Todos");
  //     fetchAllServices();
  //   } else {
  //     console.log("Categorias");
  //     fetchFilterServices();
  //   }
  // }, []);

  useEffect(() => {
    fetchAllServices();

    const intervalId = setInterval(() => {
      fetchAllServices();
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="servicios">
        <div className="container">
          <h2 className="title main-title ">SERVICIOS</h2>

          <div className="grid-available">
            {!servicesAvailables && (
              <p className="services-none">No hay ningún servicio aún</p>
            )}
            {services.map((service) => (
              <div
                key={service.id}
                className={`card ${service.done ? "done" : ""}`}
              >
                <Link to={`/service/${service.id}`}>
                  {service.done ? (
                    <img
                      className="check-icon-services"
                      src={"/icons/check.png"}
                      alt="check"
                    />
                  ) : (
                    ""
                  )}
                  <div className="card-content">
                    <p
                      className={`date ${service.done ? "card-done-text" : ""}`}
                    >
                      {service.creation_date.split("-")[2]}-
                      {service.creation_date.split("-")[1]}-
                      {service.creation_date.split("-")[0]}
                    </p>
                    <h3 className="card-title-list">{service.title}</h3>
                    <p className="description">{service.request_body}</p>
                    <p className="service-type">{service.service_type}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesList;
