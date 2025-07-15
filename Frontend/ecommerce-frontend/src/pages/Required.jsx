import { Navigate } from "react-router-dom";

export default function Required({ children }) {
  const token = localStorage.getItem("token");

  const isProfileComplete = () => {
    const role = localStorage.getItem("role");

    if (role === "customer") {
      const address = localStorage.getItem("address");
      return address && address.trim() !== "" && address !== "Default Address";
    }

    if (role === "seller") {
      const company = localStorage.getItem("companyName");
      const address = localStorage.getItem("sellerAddress");
      return (
        company &&
        company.trim() !== "" &&
        address &&
        address.trim() !== "" &&
        company !== "Default Company" &&
        address !== "Default Address"
      );
    }

    return true;
  };

  if (!token) return <Navigate to="/login" />;
  if (!isProfileComplete()) return <Navigate to="/complete-profile" />;

  return children;
}
