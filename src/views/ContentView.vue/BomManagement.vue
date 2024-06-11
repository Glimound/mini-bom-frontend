<template>
    <div class="part-management">
        <el-container>
            <el-header>
                <TheBreadcrumb />
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!-- 导航菜单 -->
                    <TheNavMenu />
                </el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import TheBreadcrumb from '@/components/TheBreadcrumb.vue'
import TheNavMenu from '@/components/TheNavMenu.vue'
</script>

<style lang="scss">
    
</style>