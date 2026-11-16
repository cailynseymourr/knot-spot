import { useNavigate } from "react-router-dom";

function AddPatternMenu({ onClose }) {
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="menu-popup">
      <h3>Add a pattern</h3>
      <button className="btn btn-primary btn-small btn-block" onClick={() => go("/create")}>
        Write a pattern
      </button>
      <button className="btn btn-secondary btn-small btn-block" onClick={() => go("/upload")}>
        Upload a pattern
      </button>
    </div>
  );
}

export default AddPatternMenu;