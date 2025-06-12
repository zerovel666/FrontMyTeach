import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config';

export const useCoursesStore = defineStore('courses', () => {
    const courses = ref(null);

    async function getCourses() {
        console.log(courses.value)
        if (!courses.value) {
            const response = await axios.get(`${API_URL}/course/all`);
            courses.value = response.data

        }
    }

    async function setCourseById(courseData, course_id) {
        if (courseData && course_id) {
            const index = courses.value.findIndex(course => course.id === course_id);
            if (index !== -1) {
                courses.value[index] = { ...courseData };
            }
        }
    }


    return {
        courses,
        getCourses,
        setCourseById
    };
});