<script>
import moment from 'moment';

export default {
  methods: {
    setDateFormat(value) {
      const result = moment(value).format('YYYY-MM-DD HH:mm:ss');
      return result;
    },
    setCalDate(value) {
      const result = moment(value).fromNow();
      return result;
    },
  },
};
</script>
