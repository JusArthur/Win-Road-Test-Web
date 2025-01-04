import supabase from './supabase';

export const fetchPostData = async () => {
  try {
    // 定义需要加载的所有表
    const tables = [
      { name: 'exam_result', idField: 'id', valueField: 'result_name' },
      { name: 'examiner_ethnicity', idField: 'id', valueField: 'ethnicity_name' },
      { name: 'test_location', idField: 'location_id', valueField: 'location_name' },
      { name: 'examiner_gender', idField: 'id', valueField: 'gender' },
      { name: 'examiner_speed', idField: 'id', valueField: 'speed_name' },
      { name: 'examiner_attitude', idField: 'id', valueField: 'attitude_name' },
    ];

    // 使用 Promise.all 并行加载数据
    const fetchTableData = async ({ name, idField, valueField }) => {
      const { data, error } = await supabase.from(name).select(`${idField}, ${valueField}`);
      if (error) throw new Error(`Error fetching data from ${name}: ${error.message}`);
      return data.reduce((acc, item) => {
        acc[item[idField]] = item[valueField];
        return acc;
      }, {});
    };

    const results = await Promise.all(tables.map(fetchTableData));

    return {
      resultsMap: results[0], // exam_result
      ethnicitiesMap: results[1], // examiner_ethnicity
      locationsMap: results[2], // test_location
      gendersMap: results[3], // examiner_gender
      speedsMap: results[4], // examiner_speed
      attitudesMap: results[5], // examiner_attitude
    };
  } catch (error) {
    console.error('Error fetching foreign data:', error);
    throw error;
  }
};
