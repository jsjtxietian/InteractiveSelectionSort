<template>
  <div class="base">
    <h1>Selection Sort</h1>
    <h2>Introduction</h2>
    <p>
        The algorithm divides the input list into two parts: the sublist of items already sorted, which is built up 
        from left to right at the front (left) of the list, and the sublist of items remaining to be sorted that 
        occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire 
        input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element 
        in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted 
        order), and moving the sublist boundaries one element to the right. 
    </p>

    <h2>Example</h2>
    <p> Here is an example of this sort algorithm sorting five elements:  </p>

    <pre style="overflow:auto;width:auto;background-color:#f8f9fa;border:1px solid #eaecf0">
      
      Sorted sublist == ( )
      Unsorted sublist == (11, 25, 12, 22, 64)
      Least element in unsorted list == 11

      Sorted sublist ==  (11)
      Unsorted sublist == (25, 12, 22, 64)
      Least element in unsorted list == 12

      Sorted sublist == (11, 12)
      Unsorted sublist == (25, 22, 64)
      Least element in unsorted list == 22

      Sorted sublist == (11, 12, 22)
      Unsorted sublist == (25, 64)
      Least element in unsorted list == 25

      Sorted sublist == (11, 12, 22, 25)
      Unsorted sublist == (64)
      Least element in unsorted list == 64

      Sorted sublist == (11, 12, 22, 25, 64)
      Unsorted sublist == ( )
    </pre>

    <h2>Implementation</h2>
    <pre style="overflow:auto;width:auto;background-color:#f8f9fa;border:1px solid #eaecf0">
      def selection_sort(list2):
      for i in range(0, len (list2)-1):
        min_ = i
        for j in range(i + 1, len(list2)):
          if list2[j] < list2[min_]:
          min_ = j
        list2[i], list2[min_] = list2[min_], list2[i]  # swap
    </pre>

    <router-link :to="{name}">Enter {{name}} Demo</router-link>
  </div>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$route.name.split("_").pop();
    }
  }
};
</script>

<style scoped>
.base {
  text-align: left;
  max-width: 800px;
  margin: auto;
}
</style>
