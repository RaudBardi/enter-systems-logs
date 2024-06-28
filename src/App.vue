<script lang="ts">
import { defineComponent, onUnmounted, computed } from "vue";
import { AppModel } from "@/AppModel";

export default defineComponent({
    name: "App",

    setup() {
        const appModel = new AppModel();
        
        onUnmounted(() => {
            if (appModel.wsService) appModel.wsService.close();
        });
    
        appModel.wsService.connect(appModel.parseMessage);
    
        const connected = computed(() => {
            return appModel.model.connected;
        });
        
        const isAuthorized = computed(() => {
            return appModel.model.isAuthorized;
        });
        
        const userInfo = computed(() => {
            return appModel.model.userInfo;
        });
        
        const logsItems = computed(() => {
            return appModel.model.logs.Items;
        });
    
        return {
            connected,
            isAuthorized,
            userInfo,
            logsItems,
        };
    },
});
</script>

<template>
  <header>
    <div class="wrapper">
        <div>Connected {{ connected }}</div>
        <div>isAuthorized {{ isAuthorized }}</div>
        <div>UserInfo {{ userInfo }}</div>
        <div>
            <div v-for="item in logsItems">
                {{ item }}
            </div>
        </div>
    </div>
  </header>
</template>

<style scoped>

</style>
