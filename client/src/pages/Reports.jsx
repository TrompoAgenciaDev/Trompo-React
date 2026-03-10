import React, { useState, useEffect } from "react";
import "../assets/styles/reports.css";

export default function Reports() {
    const [token, setToken] = useState(localStorage.getItem("reports_token") || "");
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const apiUrl = `${import.meta.env.BASE_URL}api/reports.php`;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${apiUrl}?action=login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, pass }),
            });
            const json = await response.json();
            if (json.success) {
                setToken(json.token);
                localStorage.setItem("reports_token", json.token);
            } else {
                setError(json.error || "Credenciales inválidas");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}?action=data`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.status === 403) {
                handleLogout();
                return;
            }
            const json = await response.json();
            if (json.success) {
                setData(json.data);
            } else {
                setError(json.error);
            }
        } catch (err) {
            setError("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("reports_token");
        setData([]);
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    // SEO Protection: Prevent indexing the reports page
    useEffect(() => {
        const meta = document.createElement("meta");
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        document.head.appendChild(meta);
        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    const exportCSV = () => {
        if (data.length === 0) return;

        // Preparar encabezados (Quitamos Formulario)
        const headers = ["ID", "Fecha", "URL", "IP", "Nombre", "Apellido", "Email", "Empresa", "Teléfono", "Consulta"];

        const rows = filteredData.map(row => [
            row.id,
            row.created_at,
            row.url,
            row.ip,
            row.fields?.NOMBRE || "",
            row.fields?.APELLIDOS || "",
            row.fields?.EMAIL || "",
            row.fields?.EMPRESA || "",
            row.fields?.SMS || "",
            (row.fields?.CONSULTA || "").replace(/\n/g, " ")
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `reporte_trompo_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredData = data.filter(item => {
        const searchStr = JSON.stringify(item).toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
    });

    if (!token) {
        return (
            <div className="reports-login-container">
                <div className="login-box">
                    <h5>Panel de Reportes</h5>
                    <p>Ingresá tus credenciales para acceder</p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-msg">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? "Verificando..." : "Entrar"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Reportes de Formularios</h1>
                    <span className="badge">{filteredData.length} registros</span>
                </div>
                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={exportCSV} className="btn-export">Exportar CSV</button>
                    <button onClick={handleLogout} className="btn-logout">Salir</button>
                </div>
            </header>

            <main className="table-container">
                {loading && data.length === 0 ? (
                    <div className="loader">Cargando registros...</div>
                ) : (
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Fecha/Hora</th>
                                <th>Datos del Usuario</th>
                                <th>Consulta</th>
                                <th>Metadata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr key={row.id}>
                                    <td className="cell-date">
                                        <strong>{new Date(row.created_at).toLocaleDateString()}</strong>
                                        <span>{new Date(row.created_at).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="cell-user">
                                        <div className="user-info">
                                            <strong>{row.fields?.NOMBRE} {row.fields?.APELLIDOS}</strong>
                                            <small>{row.fields?.EMAIL}</small>
                                            <small>{row.fields?.EMPRESA}</small>
                                            <small>{row.fields?.SMS}</small>
                                        </div>
                                    </td>
                                    <td className="cell-consulta">
                                        <p>{row.fields?.CONSULTA}</p>
                                    </td>
                                    <td className="cell-meta">
                                        <small>IP: {row.ip}</small>
                                        <a href={row.url} target="_blank" rel="noreferrer" title={row.url}>Ver URL</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}
