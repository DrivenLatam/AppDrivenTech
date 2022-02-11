<template>
  <div class="input-container row justify-between items-center">
    <div class="column justify-evenly no-wrap">
      <p class="input-container__label text-weight-light">{{ label }}</p>
      <p class="input-container__text text-weight-regular" >{{ value }}</p>
    </div>
    <q-icon  @click="onWhatsAppClick" v-if="whatsapp" 
            color="green-8" name="whatsapp" size="1.8rem"
            class="whatsapp-icon"
    />
  </div>
</template>

<script>
import { defineComponent, ref, toRefs } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "InputText",
  props: ["label", "value","whatsapp"],
  setup(props, { emit }) {
    const { label, value,whatsapp } = toRefs(props);
    const onWhatsAppClick=()=>{
        emit("onWhatsAppClick")
    }
    return {onWhatsAppClick};
  },
});
</script>
<style lang="scss" scoped>
* {
  margin: 0px;
  padding: 0px;
}

.input-container {
 
  margin: 5px 0px;
  background-color: rgba(33, 33, 33, 0.025);
  border-bottom: 1px solid  $grey-6;
  border-radius: 5px 5px 0px 0px;
}
.input-container > div{
  min-height: 3.5rem;
}
.input-container__label {
  color: #000;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 0.9rem;
  
}

.input-container__text {
  font-size: 1rem;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
 
  color: rgba(0, 0, 0, 0.8);
}

.input-container p {
  padding: 0px 8px;
}
.whatsapp-icon{
  margin-right: 0.5rem;
}
</style>
