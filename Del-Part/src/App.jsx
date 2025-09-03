import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import AssignedDeliveries from './Components/AssignedDeliveries';
import Footer from './Components/Footer';
import Contact from './Components/Contact';
import Dash from './Components/Dash';
import Login from './Components/Login';
import Register from './Components/Register';
import Otp from './Components/Otp';
import OrderHistory from './Components/OrderHistory';
import TermAndConditions from './Components/TermAndConditions';
import Welcome from './Components/Welcome';

function App() {
  const location = useLocation();

  const hideHeaderFooter = ["/", "/Login", "/Register", "/Otp"];

  const shouldShowHeaderFooter = !hideHeaderFooter.includes(location.pathname);

  return (
    <>
      {shouldShowHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/AssignedDeliveries" element={<AssignedDeliveries />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Dash" element={<Dash />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/Otp" element={<Otp />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/TermAndConditions" element={<TermAndConditions />} />
      </Routes>

      {shouldShowHeaderFooter && <Footer />}
    </>
  );
}

export default App;