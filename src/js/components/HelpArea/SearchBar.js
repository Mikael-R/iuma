import React from "react";

import { Grid, Typography, TextField, ClickAwayListener } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

import { ValidatorForm } from 'react-material-ui-form-validator';
// import { getLastUserInfo } from 'js/library/utils/helpers';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: '10px',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: '500px',
    maxWidth: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  searchBoxContainer: {
    marginLeft: '15px',
    padding: '10px',
    background: 'white',
    boxShadow: '0px 12px 16px #efefef',
  },
  itemSearch: {
    padding: '8px',
    background: 'white',
    borderBottom: '1px solid lightgrey',
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      background: '#eee',
      '&>p': {
        fontWeight: '700'
      },
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  }
}));

export const SearchBar = (props) => {
  const classes = useStyles();
  // const userInfo = getLastUserInfo();
  const [dataList, setDataList] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  // const [hasMore, setHasMore] = React.useState(true);
  // const [from, setFrom] = React.useState(0);



  function getData(label) {

    if (label === null || label === '') {
      setDataList(null);
      setSearchOpen(false);
    } else {
      setDataList(null);
      setSearchOpen(true);
      const resultsHelp = Object.keys(props.lista).map((key) => {
        const helpTopic = props.lista[key]
        return helpTopic.filter((helpItem, i) => {
          if (i === 0) {
            return false
          } else {
            return helpItem.keywords.toLowerCase().indexOf(label.toLowerCase()) >= 0
          }
        })
      });
      setDataList(resultsHelp);
    }
  };

  function openHelp() {
    props.openModal();
  };

  return (
    <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
      <div style={{ width: '100%', position: 'relative' }}>
        <ValidatorForm onSubmit={() => getData()}>
          <TextField
            id="searchLabel"
            autoComplete="off"
            style={{ margin: 8, paddingTop: '20px'}}
            className={classes.searchField}
            fullWidth
            margin="normal"
            placeholder="Digite aqui sua dúvida"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => getData(e.target.value)}
          />
          {/* <InputBase id="searchLabel" autoComplete="off" placeholder="Pesquisar..." classes={{ root: classes.inputRoot, input: classes.inputInput }} /> */}

        </ValidatorForm>

        {searchOpen === false
          ? null
          : <div className={classes.searchBoxContainer}>
            <div className='search-box-scroll'>
              {dataList === null
                ? <div className='search-box' style={{ textAlign: 'center' }}>
                  {/* <CircularProgress style={{ padding: '30px', boxSizing: 'content-box' }} /> */}
                </div>
                : dataList.length === 0
                  ? <div className='search-box' style={{ padding: 5, textAlign: 'center' }}>
                    Nenhum dado encontrado
                  </div>
                  // : <InfiniteScroll dataLength={dataList.length} next={fetchMoreData()} hasMore={hasMore} loader={<LoadingLists />}>
                  : <div>
                    {Object.keys(dataList).map((key) => {
                      const item = dataList[key]
                      return item.map((valor, i) => {
                        return <Grid item key={i} xs={12} className={classes.itemSearch} onClick={() => {
                          openHelp()
                          props.helpSelect(valor);
                        }}>
                          <Typography>{valor.title}</Typography>
                        </Grid>
                      })
                    })}
                  </div>
                // </InfiniteScroll>
              }
            </div>
          </div>
        }

      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;