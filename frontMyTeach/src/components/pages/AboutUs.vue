<template>
    <TopBar />
    <div class="containerBody">
        <div class="about-us">
            <section class="hero-section">
                <div class="hero-content">
                    <h1>О платформе MyTeach</h1>
                    <p class="subtitle">Инновационное решение для цифрового образования</p>
                    <div class="logo-container" ref="logoContainer">
                        <div class="logo-text">M Y T</div>
                    </div>
                </div>
            </section>
            <section class="mission-section">
                <div class="section-content">
                    <h2>Наша миссия</h2>
                    <p>MyTeach создает единую образовательную экосистему, где учебные заведения получают доступ к
                        современным цифровым инструментам, а учащиеся - к качественному контенту в удобном формате.</p>
                </div>
            </section>

            <section class="features-section">
                <h2>Почему выбирают MyTeach</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Обширная библиотека курсов</h3>
                        <p>Доступ к сотням профессионально разработанных образовательных программ по различным
                            дисциплинам.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Для учебных заведений</h3>
                        <p>Готовое решение для цифровизации учебного процесса с инструментами аналитики и управления.
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Интерактивное обучение</h3>
                        <p>Интерактивные задания, тесты и практические упражнения для эффективного усвоения материала.
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon"></div>
                        <h3>Доступность</h3>
                        <p>Обучение в любое время и с любого устройства с синхронизацией прогресса.</p>
                    </div>
                </div>
            </section>

            <section class="stats-section">
                <h2>MyTeach в цифрах</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">150+</div>
                        <div class="stat-label">образовательных учреждений</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">500+</div>
                        <div class="stat-label">курсов</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">25k+</div>
                        <div class="stat-label">студентов</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">98%</div>
                        <div class="stat-label">удовлетворенности</div>
                    </div>
                </div>
            </section>

            <section class="team-section">
                <h2>Наша команда</h2>
                <p class="team-description">MyTeach разрабатывается командой опытных педагогов, методистов и
                    IT-специалистов, объединенных страстью к образованию и технологиям.</p>
                <div class="team-grid">
                    <div class="team-card">
                        <div class="team-avatar"></div>
                        <h3>Алексей Петров</h3>
                        <p class="position">Основатель, CEO</p>
                        <p class="bio">15 лет в сфере образовательных технологий</p>
                    </div>
                    <div class="team-card">
                        <div class="team-avatar"></div>
                        <h3>Мария Иванова</h3>
                        <p class="position">Директор по обучению</p>
                        <p class="bio">Эксперт в педагогическом дизайне</p>
                    </div>
                    <div class="team-card">
                        <div class="team-avatar"></div>
                        <h3>Дмитрий Смирнов</h3>
                        <p class="position">Технический директор</p>
                        <p class="bio">Разработчик образовательных платформ</p>
                    </div>
                </div>
            </section>

            <section class="cta-section">
                <h2>Готовы начать?</h2>
                <p>Присоединяйтесь к MyTeach и откройте новые возможности для вашего учебного заведения.</p>
            </section>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import FooterBar from '../layouts/FooterBar.vue'
import TopBar from '../layouts/TopBar.vue'

const logoContainer = ref(null)

onMounted(() => {
    initThreeJSLogo()
})

    const initThreeJSLogo = () => {
        // Размеры контейнера
        const width = logoContainer.value.clientWidth
        const height = Math.min(width, 420)

        // Сцена
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x1a1a1a)

        // Камера
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.z = 5

        // Рендерер
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        logoContainer.value.appendChild(renderer.domElement)

        // Освещение
        const ambientLight = new THREE.AmbientLight(0x404040)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(1, 1, 1)
        scene.add(directionalLight)

        // Создаем центральный шар
        const createCentralSphere = () => {
            const geometry = new THREE.SphereGeometry(2.1, 32, 32)
            const material = new THREE.MeshPhongMaterial({
                color: 0xa200ff,
                emissive: 0x59008e,
                emissiveIntensity: 0.5,
                shininess: 100
            })
            const sphere = new THREE.Mesh(geometry, material)
            return sphere
        }

        // Создаем орбитали
        const createOrbits = () => {
            const group = new THREE.Group()

            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0xb14788,
                transparent: false,
                opacity: 1,
            })

            // Три орбитали (X, Y, Z оси)
            const orbits = [
                { radius: 2.9, rotation: [0, 0, 0] },       // XY плоскость
                { radius: 2.9, rotation: [Math.PI / 2, 0, 0] }, // XZ плоскость
                { radius: 2.9, rotation: [0, Math.PI / 3, 0] },  // YZ плоскость
            ]

            orbits.forEach(orbit => {
                const curve = new THREE.EllipseCurve(
                    0, 0,            // центр
                    orbit.radius, orbit.radius, // радиус X, Y
                    0, 2 * Math.PI,   // начальный и конечный угол
                    false,            // по часовой стрелке
                    300                 // угол поворота
                )

                const points = curve.getPoints(100)
                const geometry = new THREE.BufferGeometry().setFromPoints(points)

                const line = new THREE.Line(geometry, orbitMaterial)
                line.rotation.set(...orbit.rotation)
                group.add(line)
            })

            return group
        }

        const centralSphere = createCentralSphere()
        scene.add(centralSphere)

        const orbits = createOrbits()
        scene.add(orbits)

        // Анимация
        const animate = () => {
            requestAnimationFrame(animate)

            // Вращение орбит
            orbits.rotation.x += 0.002
            orbits.rotation.y += 0.003

            renderer.render(scene, camera)
        }

        animate()

        // Обработка изменения размера
        window.addEventListener('resize', () => {
            const newWidth = logoContainer.value.clientWidth
            const newHeight = Math.min(newWidth, 400)

            camera.aspect = newWidth / newHeight
            camera.updateProjectionMatrix()

            renderer.setSize(newWidth, newHeight)
        })
    }
</script>

<style scoped>
.logo-container {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 400px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-text {
    position: absolute;
    font-size: 5rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 15px rgba(162, 0, 255, 0.8);
    z-index: 10;
    pointer-events: none;
    mix-blend-mode: overlay;
}

/* Остальные стили остаются без изменений */
.about-us {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    color: #e1e1e1;
}

.hero-section {
    text-align: center;
    margin-bottom: 4rem;
}

.hero-section h1 {
    font-size: 2.5rem;
    color: #59008E;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1.2rem;
    color: #6D6D6D;
    margin-bottom: 2rem;
}

@media (max-width: 768px) {
    .hero-section h1 {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1rem;
    }

    .logo-text {
        font-size: 3rem;
    }
}

.imgPrev img {
    width: 100%;
    max-width: 600px;
    height: auto;
    margin: 0 auto;
}

section {
    margin-bottom: 4rem;
}

h2 {
    font-size: 2rem;
    color: #a200ff;
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
}

h2::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background: #B14788;
    margin: 0.5rem auto;
}

.mission-section {
    background-color: #333;
    padding: 3rem 2rem;
    border-radius: 16px;
    text-align: center;
}

.mission-section p {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.1rem;
    line-height: 1.6;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: #333;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(89, 0, 142, 0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: #a200ff;
    margin-bottom: 1rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.stat-item {
    text-align: center;
    background: #333;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(89, 0, 142, 0.1);
}

.stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #a200ff;
    margin-bottom: 0.5rem;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.team-card {
    text-align: center;
    background: #333;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(89, 0, 142, 0.1);
}

.team-avatar {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.team-card h3 {
    color: #a200ff;
    margin-bottom: 0.5rem;
}

.position {
    font-weight: bold;
    color: #B14788;
    margin-bottom: 0.5rem;
}

.cta-section {
    text-align: center;
    background: linear-gradient(135deg, #59008E 0%, #6a1b9a 100%);
    padding: 4rem 2rem;
    border-radius: 16px;
    color: white;
}

.cta-section h2 {
    color: white;
}

.cta-section h2::after {
    background: #B14788;
}

.cta-button {
    background: white;
    color: #59008E;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1.5rem;
}

.cta-button:hover {
    background: #f0e5ff;
    transform: translateY(-2px);
}
</style>