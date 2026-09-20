function columnIndex(
  letters,
) {
  let value = 0;

  for (const letter of letters) {
    value =
      value * 26 +
      (
        letter.charCodeAt(0) -
        64
      );
  }

  return value - 1;
}

function parseRange(range) {
  const match =
    /^'((?:''|[^'])+)'!([A-Z]+)(\d*):([A-Z]+)(\d*)$/.exec(
      range,
    );

  if (!match) {
    throw new Error(
      `Unsupported fake Sheets range: ${range}`,
    );
  }

  return {
    title:
      match[1].replace(
        /''/g,
        "'",
      ),
    startColumn:
      columnIndex(match[2]),
    startRow:
      match[3]
        ? Number(match[3]) - 1
        : 0,
    endColumn:
      columnIndex(match[4]),
    endRow:
      match[5]
        ? Number(match[5]) - 1
        : null,
  };
}

function createFakeSheetsClient({
  initialSheets = {},
} = {}) {
  const workbook =
    new Map(
      Object.entries(
        initialSheets,
      ).map(
        ([title, rows]) => [
          title,
          rows.map(
            (row) => [
              ...row,
            ],
          ),
        ],
      ),
    );

  const calls = [];

  function ensureSheet(title) {
    if (!workbook.has(title)) {
      throw new Error(
        `Unknown fake sheet: ${title}`,
      );
    }

    return workbook.get(title);
  }

  const values = {
    async get({
      spreadsheetId,
      range,
    }) {
      calls.push({
        method: "values.get",
        spreadsheetId,
        range,
      });

      const parsed =
        parseRange(range);
      const rows =
        ensureSheet(
          parsed.title,
        );
      const lastRow =
        parsed.endRow === null
          ? rows.length - 1
          : Math.min(
              parsed.endRow,
              rows.length - 1,
            );

      if (
        parsed.startRow >
        lastRow
      ) {
        return {
          data: {
            values: [],
          },
        };
      }

      const selected = [];

      for (
        let rowIndex =
          parsed.startRow;
        rowIndex <= lastRow;
        rowIndex += 1
      ) {
        const row =
          rows[rowIndex] || [];
        const slice =
          row.slice(
            parsed.startColumn,
            parsed.endColumn + 1,
          );

        while (
          slice.length > 0 &&
          slice[
            slice.length - 1
          ] === undefined
        ) {
          slice.pop();
        }

        selected.push(slice);
      }

      while (
        selected.length > 0 &&
        selected[
          selected.length - 1
        ].length === 0
      ) {
        selected.pop();
      }

      return {
        data: {
          values: selected,
        },
      };
    },

    async update({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody,
    }) {
      calls.push({
        method: "values.update",
        spreadsheetId,
        range,
        valueInputOption,
      });

      const parsed =
        parseRange(range);
      const rows =
        ensureSheet(
          parsed.title,
        );

      requestBody.values.forEach(
        (sourceRow, offset) => {
          const rowIndex =
            parsed.startRow +
            offset;

          while (
            rows.length <= rowIndex
          ) {
            rows.push([]);
          }

          const target =
            rows[rowIndex];

          sourceRow.forEach(
            (value, columnOffset) => {
              target[
                parsed.startColumn +
                  columnOffset
              ] = value;
            },
          );
        },
      );

      return {
        data: {},
      };
    },

    async append({
      spreadsheetId,
      range,
      valueInputOption,
      insertDataOption,
      requestBody,
    }) {
      calls.push({
        method: "values.append",
        spreadsheetId,
        range,
        valueInputOption,
        insertDataOption,
      });

      const parsed =
        parseRange(range);
      const rows =
        ensureSheet(
          parsed.title,
        );

      for (
        const row of
        requestBody.values
      ) {
        rows.push([...row]);
      }

      return {
        data: {},
      };
    },

    async clear({
      spreadsheetId,
      range,
    }) {
      calls.push({
        method: "values.clear",
        spreadsheetId,
        range,
      });

      const parsed =
        parseRange(range);
      const rows =
        ensureSheet(
          parsed.title,
        );

      for (
        let rowIndex =
          parsed.startRow;
        rowIndex < rows.length;
        rowIndex += 1
      ) {
        for (
          let column =
            parsed.startColumn;
          column <=
          parsed.endColumn;
          column += 1
        ) {
          rows[rowIndex][column] =
            undefined;
        }
      }

      return {
        data: {},
      };
    },
  };

  const sheets = {
    spreadsheets: {
      values,

      async get({
        spreadsheetId,
      }) {
        calls.push({
          method:
            "spreadsheets.get",
          spreadsheetId,
        });

        return {
          data: {
            sheets:
              Array.from(
                workbook.keys(),
              ).map(
                (title) => ({
                  properties: {
                    title,
                  },
                }),
              ),
          },
        };
      },

      async batchUpdate({
        spreadsheetId,
        requestBody,
      }) {
        calls.push({
          method:
            "spreadsheets.batchUpdate",
          spreadsheetId,
        });

        for (
          const request of
          requestBody.requests
        ) {
          if (request.addSheet) {
            const title =
              request.addSheet
                .properties.title;

            if (!workbook.has(title)) {
              workbook.set(
                title,
                [],
              );
            }
          }
        }

        return {
          data: {},
        };
      },
    },
  };

  return {
    sheets,
    calls,
    workbook,
  };
}

module.exports = {
  createFakeSheetsClient,
};
