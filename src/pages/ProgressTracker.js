import { useNavigate } from "react-router-dom";

function ProgressTracker() {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: "Dragon Plushie",
      progress: 50,
      rowsCompleted: "35 / 70",
      note: "Working on wings",
      estimatedCompletion: "Oct 15"
    },
    {
      id: 2,
      name: "Granny Square Blanket",
      progress: 75,
      rowsCompleted: "60 / 80",
      note: "Need more cream yarn",
      estimatedCompletion: "Oct 8"
    }
  ];

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto"
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "30px"
        }}
      >
        Progress Tracker
      </h1>

      <h2>Current Projects</h2>

      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => navigate(`/pattern/${project.id}`)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            cursor: "pointer",
            background: "#fff"
          }}
        >
          <h3>{project.name}</h3>

          <div
            style={{
              width: "100%",
              height: "20px",
              background: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                width: `${project.progress}%`,
                height: "100%",
                background: "#d9c4ff"
              }}
            />
          </div>

          <p>
            <strong>Progress:</strong> {project.progress}%
          </p>

          <p>
            <strong>Rows Completed:</strong> {project.rowsCompleted}
          </p>

          <p>
            <strong>Recent Note:</strong> {project.note}
          </p>

          <p>
            <strong>Estimated Completion:</strong>{" "}
            {project.estimatedCompletion}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProgressTracker;
