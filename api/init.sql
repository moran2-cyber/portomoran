-- Init database portomoran
-- File ini dijalankan otomatis saat container PostgreSQL pertama kali dibuat

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tech_stack VARCHAR(200),
    github_url VARCHAR(300),
    demo_url VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data projects
INSERT INTO projects (title, description, tech_stack, github_url, demo_url) VALUES
(
    'portomoran',
    'Portfolio website dengan full production stack — Docker, CI/CD, monitoring',
    'HTML, CSS, JS, Docker, Nginx, Prometheus, Grafana',
    'https://github.com/moran2-cyber/portomoran',
    'https://moran-porto.my.id'
),
(
    'CI/CD Pipeline',
    'Automated deployment pipeline dengan GitHub Actions dan self-hosted runner',
    'GitHub Actions, Docker, Shell Script',
    'https://github.com/moran2-cyber/portomoran',
    'https://moran-porto.my.id'
);
