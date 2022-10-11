<template>
  <div class="skeleton-item">
    <el-skeleton style="width: auto" animated>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="
            margin: 0.25rem 0 0.5rem 0;
            width: 40%;
            height: 3rem;
            text-align: left;
          "
        />
        <div class="b-box">
          <el-skeleton-item
            variant="text"
            style="
              margin: 0.25rem 0 0.75rem 0;
              padding: 0.5rem 0px 0px 0.2rem;
              width: 30%;
              height: 1rem;
              text-align: right;
            "
          />
          <el-skeleton-item
            variant="text"
            style="
              margin: 0.5rem 0 0.5rem 0;
              padding: 0.25rem;
              width: 30%;
              height: 1.2rem;
              text-align: center;
            "
          />
        </div>
      </template>
    </el-skeleton>
  </div>
  <div class="skeleton-item">
    <el-skeleton style="width: auto" animated>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="
            margin: 0.25rem 0 0.5rem 0;
            width: 40%;
            height: 3rem;
            text-align: left;
          "
        />
        <div class="b-box">
          <el-skeleton-item
            variant="text"
            style="
              margin: 0.25rem 0 0.75rem 0;
              padding: 0.5rem 0px 0px 0.2rem;
              width: 30%;
              height: 1rem;
              text-align: right;
            "
          />
          <el-skeleton-item
            variant="text"
            style="
              margin: 0.5rem 0 0.5rem 0;
              padding: 0.25rem;
              width: 30%;
              height: 1.2rem;
              text-align: center;
            "
          />
        </div>
      </template>
    </el-skeleton>
  </div>
  <div class="skeleton-item">
    <el-skeleton style="width: auto" animated>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="
            margin: 0.25rem 0 0.5rem 0;
            width: 40%;
            height: 3rem;
            text-align: left;
          "
        />
        <div class="b-box">
          <el-skeleton-item
            variant="text"
            style="
              margin: 0.25rem 0 0.75rem 0;
              padding: 0.5rem 0px 0px 0.2rem;
              width: 30%;
              height: 1rem;
              text-align: right;
            "
          />
          <el-skeleton-item
            variant="text"
            style="
              margin: 0.5rem 0 0.5rem 0;
              padding: 0.25rem;
              width: 30%;
              height: 1.2rem;
              text-align: center;
            "
          />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
<script>
export default {
  name: "Skeleton",
};
</script>
<style style="scss" scoped>
.skeleton-item {
  width: auto;
  height: auto;
  margin: 0 2rem 0.5rem;
  padding: 1.5rem 0.5rem 1rem;
  background-color: #fff;
  margin-bottom: 1.5rem;
}


.b-box {
  display: flex;
  flex-direction: column;
}

.b-box:first-child {
  text-align: end !important;
}
</style>
