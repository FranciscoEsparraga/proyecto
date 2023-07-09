import { useEffect, useState } from "react";
import useServer from "../../hooks/useServer";
import { Link } from "react-router-dom";
import "./style.css";

function ServicesByUser({ nickname }) {
  const { get } = useServer();
  const [serviceUser, setServiceUser] = useState([]);

  const fetchServicesByNickname = async (nickname) => {
    try {
      const { data } = await get({ url: `/service/nickname/${nickname}` });
      setServiceUser(data.message);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchServicesByNickname(nickname);
  }, []);
  return (
    <>
      {serviceUser.length !== 0 ? (
        <p className="title-user">Servicios de {`${nickname}`}</p>
      ) : (
        <p className="message">
          {`${nickname}`} aún no ha subido ningún servicio
        </p>
      )}
      {serviceUser.map((service) => (
        <div key={service.id} className="service-wrapper">
          <Link to={`/service/${service.id}`} className="service-link">
            <div className={service.done ? "card done" : "card"}>
              {service.done ? (
                <img
                  className="check-icon"
                  src={"/icons/check.png"}
                  alt="check"
                />
              ) : (
                ""
              )}

              <div>
                <h3 className="card-title-user">{service.title}</h3>

                <p className="description-user">{service.request_body}</p>

                <p className="service-type">{service.service_type}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}

export default ServicesByUser;
