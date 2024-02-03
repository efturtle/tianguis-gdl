<script setup lang="ts">
import TextInput from '../components/TextInput.vue';
import Label from '../components/Label.vue';
import FormButton from '../components/FormButton.vue';

const nuevoTianguis = () => {
  const nombre = document.getElementById('nombre') as HTMLInputElement;
  const empieza = document.getElementById('empieza') as HTMLInputElement;
  const termina = document.getElementById('termina') as HTMLInputElement;

  let formData = new FormData();
  formData.append('nombre', nombre.value);
  formData.append('empieza', empieza.value);
  formData.append('termina', termina.value);

  fetch('http://localhost:3000/')
  .then((response) => {
    console.log(response);
  });

  // fetch('http://localhost:3000/tianguis', {
  //   method: 'POST',
  //   body: formData,
  // })
  // .then((response) => {
  //   console.log(response);
  // });
}
</script>

<template>
  <p class="text-2xl">Existe algun tianguis en tu zona y no lo encontraste aqui?</p>
  <div class="py-3">
    <Label>Nombre del tianguis</Label>
    <TextInput id="nombre" />
  </div>

  <p class="text-xl">Utilizando puntos en maps</p>
  <div class="pt-3 grid grid-cols-10">
    <div class="col-span-3">
      <Label>Empieza en</Label>
      <TextInput id="empieza" />
    </div>

    <div class="col-span-3">
      <Label>Termina en</Label>
      <TextInput id="termina" />
    </div>
  </div>

  <FormButton value="Enviar" type="submit" @click="nuevoTianguis" />
</template>
