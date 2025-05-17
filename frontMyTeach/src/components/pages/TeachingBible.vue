<template>
    <TopBar />
    <div class="containerBody">
        <div class="content">
            <div class="statsContainer">
                <div class="statCard">
                    <div class="statIcon">
                        <img src="/src/assets/Icons/Course.svg" alt="">
                    </div>
                    <div class="statInfo">
                        <div class="statValue">{{ count_courses }}</div>
                        <div class="statLabel">Всего курсов</div>
                    </div>
                </div>

                <div class="statCard">
                    <div class="statIcon">
                        <img src="/src/assets/Icons/Task.svg" alt="">
                    </div>
                    <div class="statInfo">
                        <div class="statValue">{{ count_tasks }}</div>
                        <div class="statLabel">Всего заданий</div>
                    </div>
                </div>
            </div>

            <div class="coursesSection">
                <h2 class="sectionTitle">
                    Опубликованные курсы
                    <span class="countBadge">{{ publishCourses.length }}</span>
                </h2>

                <div class="coursesGrid">
                    <div v-for="course in publishCourses" :key="course.id" class="courseCard"
                        @click="pushById(course.id)">
                        <div class="courseImage" :style="{ backgroundImage: `url(${course.image_path})` }">
                            <div class="courseRating">
                                {{ course.rating || '0' }} <img src="/src/assets/Icons/Star.svg" alt="">
                            </div>
                        </div>
                        <div class="courseContent">
                            <h3 class="courseTitle">{{ course.name }}</h3>
                            <div class="courseCategory">{{ course.category }}</div>

                            <div class="courseMeta">
                                <div class="metaItem">
                                    {{ course.task_count }} заданий
                                </div>
                            </div>

                            <div class="tagsContainer">
                                <span v-for="tag in course.tags.slice(0, 3)" :key="tag.id" class="tag">
                                    #{{ tag.tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="coursesSection">
                <h2 class="sectionTitle">Неопубликованные курсы<span class="countBadge">{{ noPublishCourses.length
                        }}</span>
                </h2>

                <div class="coursesGrid">
                    <div v-for="course in noPublishCourses" :key="course.id" class="courseCard draft">
                        <div class="courseImage" :style="{ backgroundImage: `url(${course.image_path})` }">
                            <div class="draftBadge">Черновик</div>
                            <div class="statusIcon">{{course.status}}</div>
                        </div>
                        <div class="courseContent">
                            <h3 class="courseTitle">{{ course.name }}</h3>
                            <div class="courseCategory">{{ course.category }}</div>

                            <div class="courseMeta">
                                <div class="metaItem">{{ course.task_count }} заданий</div>
                            </div>

                            <div class="tagsContainer">
                                <span v-for="tag in course.tags.slice(0, 3)" :key="tag.id" class="tag">#{{ tag.tag
                                    }}</span>
                            </div>

                            <div class="courseActions">
                                <button class="actionButton edit" @click="goToEdit(course.id)">Редактировать</button>
                                <button class="actionButton publish" @click="publish(course.id)">Опубликовать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterBar />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FooterBar from '../layouts/FooterBar.vue';
import TopBar from '../layouts/TopBar.vue';
import axios from 'axios';
import { API_URL } from '@/config';
import { useRouter } from 'vue-router';

const router = useRouter();
const publishCourses = ref([]);
const noPublishCourses = ref([]);
const count_courses = ref(0);
const count_tasks = ref(0);

const getCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/teacher/allMyInfo`);
        publishCourses.value = response.data.courses.publish;
        noPublishCourses.value = response.data.courses.noPublish;
        count_courses.value = response.data.count_courses;
        count_tasks.value = response.data.count_tasks;

    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

const pushById = async (id) => {
    router.push(`/course/info/${id}`)
}

const goToEdit = async (id) => {
    router.push(`/main/course/editor/${id}`)
}

const publish = async (id) => {
    await axios.post(`${API_URL}/course/sendAdminForCheck/${id}`)
    await getCourses();
}

onMounted(() => {
    getCourses();
});
</script>

<style scoped>
.containerBody {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 120px);
}

.content {
    padding: 20px 0;
}

.sectionTitle {
    font-size: 1.5rem;
    color: #E0E0E0;
    margin: 30px 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.countBadge {
    background: #6800A5;
    color: white;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-left: 10px;
}

.statsContainer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.statCard {
    background: #5A217C;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-left: 4px solid #5A217C;
}

.statIcon {
    width: 50px;
    height: 50px;
    background: #3D005C;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.statIcon img {
    width: 20px;
    height: 20px;
}

.statInfo {
    flex: 1;
}

.statValue {
    font-size: 2rem;
    font-weight: bold;
    color: #E0E0E0;
    line-height: 1;
}

.statLabel {
    font-size: 0.9rem;
    color: #B0B0B0;
    margin-top: 5px;
}

.coursesGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.courseCard {
    background: #252525;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #333;
    cursor: pointer;
}

.courseCard:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border-color: #6800A5;
}

.courseCard.draft {
    border-left: 4px solid #FFA500;
}

.courseImage {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.courseRating {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: gold;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.courseRating img {
    width: 15px;
    height: 15px;
}

.draftBadge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #FFA500;
    color: #333;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
}

.statusIcon {
    position: absolute;
    top: 40px;
    left: 10px;
    background: #FFA500;
    color: #333;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
}

.courseContent {
    padding: 15px;
    background: #6800A5;
}

.courseTitle {
    font-size: 1.1rem;
    color: #E0E0E0;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.courseCategory {
    font-size: 0.8rem;
    color: #dcdcdc;
    margin-bottom: 10px;
}

.courseMeta {
    display: flex;
    gap: 15px;
    margin: 10px 0;
    font-size: 0.8rem;
    color: #dcdcdc;
}

.tagsContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 10px;
}

.tag {
    background: #1E1E1E;
    color: #B0B0B0;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
}

.courseActions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.actionButton {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 5px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.actionButton.edit {
    background: #333;
    color: #E0E0E0;
}

.actionButton.edit:hover {
    background: #444;
}

.actionButton.publish {
    background: #5A217C;
    color: white;
}

.actionButton.publish:hover {
    background: #6800A5;
}

@media (max-width: 768px) {
    .statsContainer {
        grid-template-columns: 1fr;
    }

    .coursesGrid {
        grid-template-columns: 1fr;
    }

    .courseActions {
        flex-direction: column;
    }
}
</style>